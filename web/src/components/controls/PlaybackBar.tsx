'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import type { PlaybackState } from '@/lib/types/algorithm';

interface PlaybackBarProps {
  currentIndex: number;
  totalSteps: number;
  progress: number;
  playbackState: PlaybackState;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSeek: (index: number) => void;
  onSetSpeed: (speed: number) => void;
}

export function PlaybackBar({
  currentIndex,
  totalSteps,
  progress,
  playbackState,
  speed,
  onPlay,
  onPause,
  onStop,
  onStepForward,
  onStepBackward,
  onSetSpeed,
}: PlaybackBarProps) {
  return (
    <GlassCard className="px-4 py-3">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-5">
        {/* Step counter */}
        <span className="text-xs font-mono text-text-tertiary w-16">
          {currentIndex + 1}/{totalSteps}
        </span>

        <div className="flex-1" />

        {/* Controls */}
        <button onClick={onStepBackward} className="text-text-primary hover:text-accent-cyan transition-colors" title="Step back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>

        <button
          onClick={playbackState === 'playing' ? onPause : onPlay}
          className="text-accent-cyan hover:text-accent-purple transition-colors"
          title={playbackState === 'playing' ? 'Pause' : 'Play'}
        >
          {playbackState === 'playing' ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button onClick={onStepForward} className="text-text-primary hover:text-accent-cyan transition-colors" title="Step forward">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>

        <button onClick={onStop} className="text-text-tertiary hover:text-text-primary transition-colors" title="Reset">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
        </button>

        <div className="flex-1" />

        {/* Speed */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-tertiary">{speed.toFixed(1)}x</span>
          <input
            type="range"
            min="0.25"
            max="8"
            step="0.25"
            value={speed}
            onChange={(e) => onSetSpeed(parseFloat(e.target.value))}
            className="w-20 accent-accent-cyan"
          />
        </div>
      </div>
    </GlassCard>
  );
}
