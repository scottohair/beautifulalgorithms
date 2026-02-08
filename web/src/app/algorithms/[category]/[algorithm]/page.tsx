'use client';

import { useEffect, useState, use } from 'react';
import { useAlgorithmEngine } from '@/hooks/useAlgorithmEngine';
import { useVisualizationStore } from '@/stores/visualization-store';
import { CanvasRenderer } from '@/components/visualization/CanvasRenderer';
import { PlaybackBar } from '@/components/controls/PlaybackBar';
import { CodePanel } from '@/components/ui/CodePanel';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonBadge } from '@/components/ui/NeonBadge';
import Link from 'next/link';

interface AlgorithmPageProps {
  params: Promise<{ category: string; algorithm: string }>;
}

export default function AlgorithmPage({ params }: AlgorithmPageProps) {
  const { algorithm: algorithmId } = use(params);
  const { availableAlgorithms, inputArray, generateRandomInput } = useVisualizationStore();
  const engine = useAlgorithmEngine();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  const algorithm = availableAlgorithms.find((a) => a.id === algorithmId);

  useEffect(() => {
    if (algorithm) {
      engine.load(algorithm, inputArray);
    }
  }, [algorithm, inputArray]);

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth - 340, 1000);
      setCanvasSize({ width: Math.max(400, width), height: 400 });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!algorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Algorithm not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-3 flex items-center gap-4">
        <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-[17px] font-semibold text-text-primary">{algorithm.name}</h1>
      </header>

      <div className="flex p-4 gap-4 h-[calc(100vh-52px)]">
        {/* Main visualization */}
        <div className="flex-1 flex flex-col gap-4">
          <GlassCard className="flex-1 flex items-center justify-center p-5">
            <CanvasRenderer
              step={engine.currentStep}
              width={canvasSize.width}
              height={canvasSize.height}
            />
          </GlassCard>

          <PlaybackBar
            currentIndex={engine.currentIndex}
            totalSteps={engine.totalSteps}
            progress={engine.progress}
            playbackState={engine.playbackState}
            speed={engine.speed}
            onPlay={engine.play}
            onPause={engine.pause}
            onStop={engine.stop}
            onStepForward={engine.stepForward}
            onStepBackward={engine.stepBackward}
            onSeek={engine.seek}
            onSetSpeed={engine.setSpeed}
          />
        </div>

        {/* Side panel */}
        <div className="w-[280px] flex flex-col gap-4">
          {/* Info */}
          <GlassCard className="p-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2">{algorithm.name}</h2>
            <div className="flex gap-2 flex-wrap mb-3">
              <NeonBadge text={algorithm.timeComplexity.average} />
              <NeonBadge text={`Space: ${algorithm.spaceComplexity}`} color="purple" />
            </div>
            {engine.currentStep && (
              <p className="text-sm text-text-secondary">{engine.currentStep.description}</p>
            )}
          </GlassCard>

          {/* Code */}
          <CodePanel
            pseudocode={algorithm.pseudocode}
            currentLine={engine.currentStep?.pseudocodeLine ?? -1}
          />

          <div className="flex-1" />

          {/* Random input button */}
          <button
            onClick={() => generateRandomInput()}
            className="flex items-center justify-center gap-2 text-sm font-medium text-accent-cyan
              px-4 py-2.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20
              hover:bg-accent-cyan/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
            </svg>
            Random Input
          </button>
        </div>
      </div>
    </div>
  );
}
