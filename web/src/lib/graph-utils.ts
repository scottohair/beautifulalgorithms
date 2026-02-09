import type { GraphEdge, GraphData } from './types/algorithm';

/**
 * Convert an adjacency list (undirected) to a deduplicated edge list.
 * Only includes each edge once (i < j).
 */
export function adjListToEdges(adjList: number[][]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < adjList.length; i++) {
    for (const j of adjList[i]) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ source: Math.min(i, j), target: Math.max(i, j) });
      }
    }
  }
  return edges;
}

/**
 * Convert a weight matrix to a weighted edge list.
 * Only includes edges where weight < Infinity and i < j (undirected).
 */
export function weightMatrixToEdges(weights: number[][], n: number): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (weights[i][j] < Infinity) {
        edges.push({ source: i, target: j, weight: weights[i][j] });
      }
    }
  }
  return edges;
}

/**
 * Convert a directed adjacency list to a directed edge list.
 */
export function directedAdjListToEdges(adjList: number[][]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let i = 0; i < adjList.length; i++) {
    for (const j of adjList[i]) {
      edges.push({ source: i, target: j });
    }
  }
  return edges;
}

/**
 * Create a GraphData object.
 */
export function createGraphData(
  nodeCount: number,
  edges: GraphEdge[],
  directed: boolean,
  labels?: number[],
): GraphData {
  return {
    nodeCount,
    edges,
    directed,
    nodeLabels: labels,
  };
}
