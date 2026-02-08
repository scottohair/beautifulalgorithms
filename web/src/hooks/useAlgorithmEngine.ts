'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { AlgorithmStep, AlgorithmImplementation, PlaybackState } from '@/lib/types/algorithm';

export function useAlgorithmEngine() {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [speed, setSpeedState] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = steps[currentIndex] ?? null;
  const progress = steps.length > 0 ? currentIndex / (steps.length - 1) : 0;
  const totalSteps = steps.length;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const load = useCallback((algorithm: AlgorithmImplementation, input: number[]) => {
    clearTimer();
    const generated = algorithm.generateSteps(input);
    setSteps(generated);
    setCurrentIndex(0);
    setPlaybackState(generated.length > 0 ? 'paused' : 'idle');
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= steps.length - 1) {
        clearTimer();
        setPlaybackState('finished');
        return prev;
      }
      return prev + 1;
    });
  }, [steps.length, clearTimer]);

  const startTimer = useCallback(() => {
    clearTimer();
    const interval = 400 / speed;
    timerRef.current = setInterval(() => {
      stepForward();
    }, interval);
  }, [speed, stepForward, clearTimer]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    setCurrentIndex((prev) => {
      if (prev >= steps.length - 1) return 0;
      return prev;
    });
    setPlaybackState('playing');
    startTimer();
  }, [steps.length, startTimer]);

  const pause = useCallback(() => {
    setPlaybackState('paused');
    clearTimer();
  }, [clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setCurrentIndex(0);
    setPlaybackState('idle');
  }, [clearTimer]);

  const stepBackward = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return 0;
      if (playbackState === 'finished') setPlaybackState('paused');
      return prev - 1;
    });
  }, [playbackState]);

  const seek = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, steps.length - 1));
    setCurrentIndex(clamped);
    if (clamped >= steps.length - 1) {
      clearTimer();
      setPlaybackState('finished');
    }
  }, [steps.length, clearTimer]);

  const setSpeed = useCallback((newSpeed: number) => {
    const clamped = Math.max(0.25, Math.min(8, newSpeed));
    setSpeedState(clamped);
    if (playbackState === 'playing') {
      clearTimer();
      const interval = 400 / clamped;
      timerRef.current = setInterval(() => {
        stepForward();
      }, interval);
    }
  }, [playbackState, stepForward, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setSteps([]);
    setCurrentIndex(0);
    setPlaybackState('idle');
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    steps,
    currentIndex,
    currentStep,
    playbackState,
    speed,
    progress,
    totalSteps,
    load,
    play,
    pause,
    stop,
    stepForward,
    stepBackward,
    seek,
    setSpeed,
    reset,
  };
}
