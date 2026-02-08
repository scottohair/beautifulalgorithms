'use client';

import { useEffect, useRef } from 'react';
import type { AlgorithmStep } from '@/lib/types/algorithm';

interface CanvasRendererProps {
  step: AlgorithmStep | null;
  width?: number;
  height?: number;
}

const COLORS = {
  comparing: '#00f0ff',
  swapping: '#ec4899',
  sorted: '#10b981',
  active: '#a855f7',
  default: '#3f3f46',
  text: '#f5f5f7',
  background: '#0a0a0b',
};

export function CanvasRenderer({ step, width = 800, height = 400 }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !step) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, width, height);

    const { array, highlightedIndices, sortedIndices, type } = step;
    if (array.length === 0) return;

    const maxVal = Math.max(...array);
    const barSpacing = 2;
    const barWidth = (width - (array.length - 1) * barSpacing) / array.length;

    array.forEach((value, index) => {
      const barHeight = (value / maxVal) * (height - 30);
      const x = index * (barWidth + barSpacing);
      const y = height - barHeight;

      // Determine color
      let color = COLORS.default;
      if (sortedIndices.includes(index)) {
        color = COLORS.sorted;
      } else if (highlightedIndices.includes(index)) {
        color = type === 'compare' ? COLORS.comparing : type === 'swap' ? COLORS.swapping : COLORS.active;
      }

      // Draw bar with rounded top corners
      const radius = Math.min(barWidth / 4, 4);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, height);
      ctx.lineTo(x, height);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Glow for highlighted
      if (highlightedIndices.includes(index)) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Value label
      if (barWidth > 20) {
        ctx.fillStyle = COLORS.text;
        ctx.font = `${Math.min(barWidth * 0.35, 12)}px JetBrains Mono, monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(String(value), x + barWidth / 2, y - 6);
      }
    });
  }, [step, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  );
}
