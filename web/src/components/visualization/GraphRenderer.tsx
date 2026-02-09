'use client';

import { useMemo } from 'react';
import type { AlgorithmStep, GraphData, GraphEdge } from '@/lib/types/algorithm';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3';

interface GraphRendererProps {
  step: AlgorithmStep;
  width?: number;
  height?: number;
}

interface NodePos {
  id: number;
  x: number;
  y: number;
}

const COLORS = {
  default: '#3f3f46',
  current: '#00f0ff',
  visited: '#10b981',
  queued: '#a855f7',
  edgeDefault: 'rgba(255,255,255,0.1)',
  edgeActive: '#10b981',
  text: '#f5f5f7',
};

function computeLayout(graphData: GraphData, width: number, height: number): NodePos[] {
  const { nodeCount, edges } = graphData;

  // For small graphs, use circular layout
  if (nodeCount <= 6) {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.35;
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      return {
        id: i,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }

  // Use d3-force for larger graphs
  const nodes: (SimulationNodeDatum & { id: number })[] = Array.from(
    { length: nodeCount },
    (_, i) => ({ id: i, x: undefined, y: undefined } as SimulationNodeDatum & { id: number })
  );

  const links: SimulationLinkDatum<SimulationNodeDatum>[] = edges.map((e) => ({
    source: e.source,
    target: e.target,
  }));

  const sim = forceSimulation(nodes)
    .force('link', forceLink(links).distance(Math.min(width, height) * 0.15))
    .force('charge', forceManyBody().strength(-200))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide(24))
    .stop();

  // Run synchronously
  for (let i = 0; i < 300; i++) sim.tick();

  // Clamp positions within bounds with padding
  const pad = 30;
  return nodes.map((n) => ({
    id: n.id,
    x: Math.max(pad, Math.min(width - pad, n.x ?? width / 2)),
    y: Math.max(pad, Math.min(height - pad, n.y ?? height / 2)),
  }));
}

function edgeKey(e: GraphEdge): string {
  return `${e.source}-${e.target}`;
}

export function GraphRenderer({ step, width = 800, height = 400 }: GraphRendererProps) {
  const graphData = step.graphData!;
  const { nodeCount, edges, directed, activeEdges = [], nodeLabels } = graphData;
  const { highlightedIndices, sortedIndices, secondaryIndices } = step;

  const positions = useMemo(
    () => computeLayout(graphData, width, height),
    [nodeCount, edges.length, width, height]
  );

  const activeEdgeKeys = useMemo(
    () => new Set(activeEdges.map(edgeKey)),
    [activeEdges]
  );

  const nodeRadius = Math.max(14, Math.min(22, width / nodeCount / 3));
  const showWeights = width >= 400;
  const markerId = 'arrow-marker';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="block max-w-full"
    >
      <defs>
        {/* Glow filters */}
        <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Arrow marker for directed graphs */}
        {directed && (
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.3)" />
          </marker>
        )}
        {directed && (
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.edgeActive} />
          </marker>
        )}
      </defs>

      {/* Edges */}
      {edges.map((edge) => {
        const src = positions[edge.source];
        const tgt = positions[edge.target];
        if (!src || !tgt) return null;

        const isActive = activeEdgeKeys.has(edgeKey(edge));

        // Shorten line to stop at node boundary
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return null;

        const offsetSrc = nodeRadius / dist;
        const offsetTgt = directed ? (nodeRadius + 8) / dist : nodeRadius / dist;

        const x1 = src.x + dx * offsetSrc;
        const y1 = src.y + dy * offsetSrc;
        const x2 = tgt.x - dx * offsetTgt;
        const y2 = tgt.y - dy * offsetTgt;

        return (
          <g key={edgeKey(edge)}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isActive ? COLORS.edgeActive : COLORS.edgeDefault}
              strokeWidth={isActive ? 2 : 1}
              filter={isActive ? 'url(#glow-green)' : undefined}
              markerEnd={directed ? (isActive ? 'url(#arrow-active)' : `url(#${markerId})`) : undefined}
              style={{ transition: 'stroke 300ms, stroke-width 300ms' }}
            />
            {/* Weight label */}
            {showWeights && edge.weight != null && (
              <text
                x={(src.x + tgt.x) / 2}
                y={(src.y + tgt.y) / 2 - 6}
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
              >
                {edge.weight}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {positions.map((pos) => {
        const i = pos.id;
        const isCurrent = highlightedIndices.includes(i);
        const isVisited = sortedIndices.includes(i);
        const isQueued = secondaryIndices.includes(i);

        let fill = COLORS.default;
        let stroke = 'transparent';
        let strokeWidth = 0;
        let glowFilter: string | undefined;

        if (isCurrent) {
          fill = COLORS.default;
          stroke = COLORS.current;
          strokeWidth = 2.5;
          glowFilter = 'url(#glow-cyan)';
        } else if (isVisited) {
          fill = 'rgba(16, 185, 129, 0.3)';
          stroke = COLORS.visited;
          strokeWidth = 1.5;
        } else if (isQueued) {
          fill = 'rgba(168, 85, 247, 0.2)';
          stroke = COLORS.queued;
          strokeWidth = 1.5;
        }

        const label = nodeLabels ? nodeLabels[i] : i;

        return (
          <g key={i} style={{ transition: 'opacity 300ms' }}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              filter={glowFilter}
              style={{ transition: 'fill 300ms, stroke 300ms' }}
            />
            <text
              x={pos.x}
              y={pos.y + 1}
              fill={COLORS.text}
              fontSize={nodeRadius * 0.75}
              fontFamily="JetBrains Mono, monospace"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
