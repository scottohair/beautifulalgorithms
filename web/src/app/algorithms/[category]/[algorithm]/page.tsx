'use client';

import { useEffect, useState, use } from 'react';
import { useAlgorithmEngine } from '@/hooks/useAlgorithmEngine';
import { useVisualizationStore } from '@/stores/visualization-store';
import { CanvasRenderer } from '@/components/visualization/CanvasRenderer';
import { GraphRenderer } from '@/components/visualization/GraphRenderer';
import { PlaybackBar } from '@/components/controls/PlaybackBar';
import { CodePanel } from '@/components/ui/CodePanel';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonBadge } from '@/components/ui/NeonBadge';
import type { ViewMode } from '@/lib/types/algorithm';
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
  const isGraphCategory = algorithm?.category === 'graph';
  const availableViewModes: ViewMode[] = isGraphCategory ? ['graph', 'bar'] : ['bar'];
  const [viewMode, setViewMode] = useState<ViewMode>(isGraphCategory ? 'graph' : 'bar');

  // Reset viewMode when navigating to a different algorithm
  useEffect(() => {
    setViewMode(isGraphCategory ? 'graph' : 'bar');
  }, [algorithmId, isGraphCategory]);

  useEffect(() => {
    if (algorithm) {
      engine.load(algorithm, inputArray);
    }
  }, [algorithm, inputArray]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const width = isMobile
        ? window.innerWidth - 32
        : Math.min(window.innerWidth - 340, 1000);
      setCanvasSize({ width: Math.max(280, width), height: 400 });
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
      <header className="border-b border-white/[0.06] px-4 md:px-6 py-3 flex items-center gap-4">
        <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-[17px] font-semibold text-text-primary">{algorithm.name}</h1>
      </header>

      <div className="flex flex-col md:flex-row p-4 gap-4 md:h-[calc(100vh-52px)]">
        {/* Main visualization */}
        <div className="flex-1 flex flex-col gap-4">
          <GlassCard className="relative flex-1 flex items-center justify-center p-3 md:p-5 overflow-hidden">
            {/* View mode toggle — only for graph algorithms */}
            {availableViewModes.length > 1 && (
              <div className="absolute top-3 right-3 z-10 flex rounded-full bg-white/[0.06] border border-white/[0.08] p-0.5">
                <button
                  onClick={() => setViewMode('graph')}
                  className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-all ${
                    viewMode === 'graph'
                      ? 'bg-accent-cyan/15 text-accent-cyan'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                  aria-label="Graph view"
                  title="Graph view"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/>
                    <circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/>
                    <path d="M8.5 6H15.5M6 8.5V15.5M8.5 18H15.5M18 8.5V15.5"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('bar')}
                  className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-all ${
                    viewMode === 'bar'
                      ? 'bg-accent-cyan/15 text-accent-cyan'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                  aria-label="Bar chart view"
                  title="Bar chart view"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="6" width="4" height="15" rx="1"/>
                    <rect x="17" y="3" width="4" height="18" rx="1"/>
                  </svg>
                </button>
              </div>
            )}
            {viewMode === 'graph' && engine.currentStep ? (
              <GraphRenderer
                step={engine.currentStep}
                width={canvasSize.width}
                height={canvasSize.height}
              />
            ) : (
              <CanvasRenderer
                step={engine.currentStep}
                width={canvasSize.width}
                height={canvasSize.height}
              />
            )}
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
        <div className="w-full md:w-[280px] flex flex-col gap-4">
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

          {/* Code - collapsible on mobile */}
          <details className="md:contents" open>
            <summary className="md:hidden text-xs font-semibold font-mono tracking-[0.15em] text-text-tertiary uppercase cursor-pointer px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
              Pseudocode
            </summary>
            <CodePanel
              pseudocode={algorithm.pseudocode}
              currentLine={engine.currentStep?.pseudocodeLine ?? -1}
            />
          </details>

          <div className="flex-1 hidden md:block" />

          {/* Random input button */}
          <button
            onClick={() => generateRandomInput()}
            className="flex items-center justify-center gap-2 text-sm font-medium text-accent-cyan
              px-4 py-2.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20
              hover:bg-accent-cyan/20 active:bg-accent-cyan/25 active:scale-[0.98] transition-all"
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
