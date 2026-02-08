import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlgorithmEngine } from '@/hooks/useAlgorithmEngine';
import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

/**
 * Creates a mock algorithm implementation that generates a known number of steps.
 */
function createMockAlgorithm(stepCount: number): AlgorithmImplementation {
  const steps: AlgorithmStep[] = Array.from({ length: stepCount }, (_, i) => ({
    type: 'compare' as const,
    array: [i, i + 1, i + 2],
    highlightedIndices: [0],
    secondaryIndices: [],
    sortedIndices: [],
    pseudocodeLine: 0,
    description: `Step ${i}`,
  }));

  return {
    id: 'mock-algo',
    name: 'Mock Algorithm',
    category: 'test',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(1)',
    pseudocode: [{ line: 0, text: 'mock' }],
    generateSteps: () => steps,
  };
}

describe('useAlgorithmEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should start in idle state', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      expect(result.current.playbackState).toBe('idle');
    });

    it('should have empty steps', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      expect(result.current.steps).toEqual([]);
      expect(result.current.totalSteps).toBe(0);
    });

    it('should have currentIndex 0', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      expect(result.current.currentIndex).toBe(0);
    });

    it('should have null currentStep', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      expect(result.current.currentStep).toBeNull();
    });

    it('should have default speed of 1', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      expect(result.current.speed).toBe(1);
    });

    it('should have progress 0', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      expect(result.current.progress).toBe(0);
    });
  });

  describe('load', () => {
    it('should load algorithm and set steps', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });

      expect(result.current.steps.length).toBe(5);
      expect(result.current.totalSteps).toBe(5);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.playbackState).toBe('paused');
    });

    it('should set currentStep to first step after load', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(3);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });

      expect(result.current.currentStep).not.toBeNull();
      expect(result.current.currentStep?.description).toBe('Step 0');
    });

    it('should stay idle if algorithm generates zero steps', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const emptyAlgo = createMockAlgorithm(0);

      act(() => {
        result.current.load(emptyAlgo, []);
      });

      expect(result.current.steps.length).toBe(0);
      expect(result.current.playbackState).toBe('idle');
    });
  });

  describe('step forward', () => {
    it('should advance currentIndex by 1', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.stepForward();
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it('should not advance past the last step', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(3);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      // Step to the last index (2)
      act(() => { result.current.stepForward(); });
      act(() => { result.current.stepForward(); });
      // Now at index 2 (last). One more call should trigger finished.
      act(() => { result.current.stepForward(); });

      expect(result.current.currentIndex).toBe(2);
      expect(result.current.playbackState).toBe('finished');
    });

    it('should transition to finished when attempting to step past end', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(2);

      act(() => {
        result.current.load(mockAlgo, [1, 2]);
      });
      // Step forward: index goes from 0 to 1
      act(() => {
        result.current.stepForward();
      });

      expect(result.current.currentIndex).toBe(1);
      // The hook sets 'finished' only when prev >= steps.length - 1 at the START of stepForward.
      // After stepping to index 1 (last), next stepForward will trigger finished.
      act(() => {
        result.current.stepForward();
      });

      expect(result.current.currentIndex).toBe(1);
      expect(result.current.playbackState).toBe('finished');
    });
  });

  describe('step backward', () => {
    it('should go back one step', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => { result.current.stepForward(); });
      act(() => { result.current.stepForward(); });
      act(() => { result.current.stepBackward(); });

      expect(result.current.currentIndex).toBe(1);
    });

    it('should not go below index 0', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => { result.current.stepBackward(); });
      act(() => { result.current.stepBackward(); });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should transition from finished to paused when stepping back', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(3);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      // Navigate to end: step to index 2 (last), then attempt one more to set finished
      act(() => { result.current.stepForward(); }); // index 1
      act(() => { result.current.stepForward(); }); // index 2
      act(() => { result.current.stepForward(); }); // stays at 2, sets finished

      expect(result.current.playbackState).toBe('finished');

      act(() => {
        result.current.stepBackward();
      });

      expect(result.current.currentIndex).toBe(1);
      expect(result.current.playbackState).toBe('paused');
    });
  });

  describe('play / pause', () => {
    it('should set playbackState to playing on play', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(10);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.play();
      });

      expect(result.current.playbackState).toBe('playing');
    });

    it('should not play with empty steps', () => {
      const { result } = renderHook(() => useAlgorithmEngine());

      act(() => {
        result.current.play();
      });

      expect(result.current.playbackState).toBe('idle');
    });

    it('should set playbackState to paused on pause', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(10);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.play();
      });
      act(() => {
        result.current.pause();
      });

      expect(result.current.playbackState).toBe('paused');
    });

    it('should advance steps automatically when playing', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(10);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.play();
      });

      // Default speed is 1, so interval is 400ms
      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(result.current.currentIndex).toBeGreaterThan(0);
    });

    it('should stop advancing when paused', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(10);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.play();
      });
      act(() => {
        vi.advanceTimersByTime(400);
      });

      const indexAfterOneTick = result.current.currentIndex;

      act(() => {
        result.current.pause();
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.currentIndex).toBe(indexAfterOneTick);
    });

    it('should reset to beginning and play when at finished state', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(3);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      // Step all the way to finished
      act(() => { result.current.stepForward(); }); // index 1
      act(() => { result.current.stepForward(); }); // index 2
      act(() => { result.current.stepForward(); }); // triggers finished

      expect(result.current.playbackState).toBe('finished');

      act(() => {
        result.current.play();
      });

      // play() resets to 0 when at the end
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.playbackState).toBe('playing');
    });
  });

  describe('stop', () => {
    it('should reset to beginning and go idle', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => { result.current.stepForward(); });
      act(() => { result.current.stepForward(); });
      act(() => {
        result.current.stop();
      });

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.playbackState).toBe('idle');
    });
  });

  describe('seek', () => {
    it('should jump to a specific step', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(10);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.seek(5);
      });

      expect(result.current.currentIndex).toBe(5);
    });

    it('should clamp to last step if seeking past end', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.seek(100);
      });

      expect(result.current.currentIndex).toBe(4);
      expect(result.current.playbackState).toBe('finished');
    });

    it('should clamp to 0 if seeking negative', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.seek(-5);
      });

      expect(result.current.currentIndex).toBe(0);
    });
  });

  describe('speed', () => {
    it('should update speed', () => {
      const { result } = renderHook(() => useAlgorithmEngine());

      act(() => {
        result.current.setSpeed(2);
      });

      expect(result.current.speed).toBe(2);
    });

    it('should clamp speed to minimum 0.25', () => {
      const { result } = renderHook(() => useAlgorithmEngine());

      act(() => {
        result.current.setSpeed(0.01);
      });

      expect(result.current.speed).toBe(0.25);
    });

    it('should clamp speed to maximum 8', () => {
      const { result } = renderHook(() => useAlgorithmEngine());

      act(() => {
        result.current.setSpeed(100);
      });

      expect(result.current.speed).toBe(8);
    });

    it('should adjust playback interval when speed changes during play', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(20);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.play();
      });

      // At speed 1, interval is 400ms. Advance 400ms -> 1 step
      act(() => {
        vi.advanceTimersByTime(400);
      });
      const indexAtSpeed1 = result.current.currentIndex;

      // Change to speed 4, interval is 100ms
      act(() => {
        result.current.setSpeed(4);
      });

      // Advance 400ms at speed 4 -> should get ~4 more steps
      act(() => {
        vi.advanceTimersByTime(400);
      });

      // Should have advanced more steps due to higher speed
      expect(result.current.currentIndex).toBeGreaterThan(indexAtSpeed1 + 1);
    });
  });

  describe('reset', () => {
    it('should clear all state', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.stepForward();
      });
      act(() => {
        result.current.reset();
      });

      expect(result.current.steps).toEqual([]);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.playbackState).toBe('idle');
      expect(result.current.currentStep).toBeNull();
      expect(result.current.totalSteps).toBe(0);
    });
  });

  describe('progress', () => {
    it('should be 0 at the start', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });

      expect(result.current.progress).toBe(0);
    });

    it('should be 1 at the end', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(5);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.seek(4);
      });

      expect(result.current.progress).toBe(1);
    });

    it('should be between 0 and 1 in the middle', () => {
      const { result } = renderHook(() => useAlgorithmEngine());
      const mockAlgo = createMockAlgorithm(10);

      act(() => {
        result.current.load(mockAlgo, [1, 2, 3]);
      });
      act(() => {
        result.current.seek(5);
      });

      expect(result.current.progress).toBeGreaterThan(0);
      expect(result.current.progress).toBeLessThan(1);
    });
  });
});
