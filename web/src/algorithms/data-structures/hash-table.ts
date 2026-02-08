import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const hashTable: AlgorithmImplementation = {
  id: 'hash-table',
  name: 'Hash Table',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(key)' },
    { line: 1, text: '  index \u2190 hash(key) mod size' },
    { line: 2, text: '  append key to bucket[index]' },
    { line: 3, text: 'procedure search(key)' },
    { line: 4, text: '  index \u2190 hash(key) mod size' },
    { line: 5, text: '  for each item in bucket[index]' },
    { line: 6, text: '    if item = key then return true' },
    { line: 7, text: '  return false' },
    { line: 8, text: 'procedure delete(key)' },
    { line: 9, text: '  index \u2190 hash(key) mod size' },
    { line: 10, text: '  remove key from bucket[index]' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const bucketCount = Math.max(5, Math.ceil(input.length / 2));
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    function hash(key: number): number {
      return Math.abs(key) % bucketCount;
    }

    // Flatten buckets to an array for visualization
    // Format: interleave bucket markers (negative numbers as separators) with values
    function flattenBuckets(): number[] {
      const result: number[] = [];
      for (let b = 0; b < buckets.length; b++) {
        for (let j = 0; j < buckets[b].length; j++) {
          result.push(buckets[b][j]);
        }
        if (b < buckets.length - 1) {
          result.push(0); // separator between buckets
        }
      }
      return result;
    }

    // Get the flat index for a specific bucket and position within it
    function getFlatIndex(bucketIdx: number, posInBucket: number): number {
      let flatIdx = 0;
      for (let b = 0; b < bucketIdx; b++) {
        flatIdx += buckets[b].length;
        flatIdx += 1; // separator
      }
      return flatIdx + posInBucket;
    }

    // Get the flat index range for an entire bucket
    function getBucketIndices(bucketIdx: number): number[] {
      const indices: number[] = [];
      const start = getFlatIndex(bucketIdx, 0);
      for (let j = 0; j < buckets[bucketIdx].length; j++) {
        indices.push(start + j);
      }
      return indices;
    }

    // Phase 1: Insert all values
    for (let i = 0; i < input.length; i++) {
      const value = input[i];
      const bucketIdx = hash(value);

      // Show hash computation
      steps.push({
        type: 'highlight',
        array: flattenBuckets(),
        highlightedIndices: getBucketIndices(bucketIdx),
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 1,
        description: `hash(${value}) = ${value} mod ${bucketCount} = ${bucketIdx}`,
      });

      // Insert into bucket
      buckets[bucketIdx].push(value);

      const flatArr = flattenBuckets();
      const insertedIdx = getFlatIndex(bucketIdx, buckets[bucketIdx].length - 1);

      steps.push({
        type: 'insert',
        array: flatArr,
        highlightedIndices: [insertedIdx],
        secondaryIndices: getBucketIndices(bucketIdx),
        sortedIndices: [],
        pseudocodeLine: 2,
        description: `Insert ${value} into bucket ${bucketIdx}`,
      });
    }

    // Phase 2: Search for a few values
    const searchValues = input.slice(0, Math.min(3, input.length));
    for (const searchVal of searchValues) {
      const bucketIdx = hash(searchVal);

      steps.push({
        type: 'highlight',
        array: flattenBuckets(),
        highlightedIndices: getBucketIndices(bucketIdx),
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 4,
        description: `Search: hash(${searchVal}) = ${bucketIdx}, checking bucket`,
      });

      // Scan through bucket
      for (let j = 0; j < buckets[bucketIdx].length; j++) {
        const flatIdx = getFlatIndex(bucketIdx, j);

        steps.push({
          type: 'compare',
          array: flattenBuckets(),
          highlightedIndices: [flatIdx],
          secondaryIndices: getBucketIndices(bucketIdx),
          sortedIndices: [],
          pseudocodeLine: 6,
          description: `Compare bucket[${bucketIdx}][${j}] = ${buckets[bucketIdx][j]} with ${searchVal}`,
        });

        if (buckets[bucketIdx][j] === searchVal) {
          steps.push({
            type: 'select',
            array: flattenBuckets(),
            highlightedIndices: [flatIdx],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 6,
            description: `Found ${searchVal} at bucket ${bucketIdx}, position ${j}`,
          });
          break;
        }
      }
    }

    // Phase 3: Delete first value
    if (input.length > 0) {
      const deleteVal = input[0];
      const bucketIdx = hash(deleteVal);

      steps.push({
        type: 'highlight',
        array: flattenBuckets(),
        highlightedIndices: getBucketIndices(bucketIdx),
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 9,
        description: `Delete: hash(${deleteVal}) = ${bucketIdx}`,
      });

      const pos = buckets[bucketIdx].indexOf(deleteVal);
      if (pos !== -1) {
        const flatIdx = getFlatIndex(bucketIdx, pos);

        steps.push({
          type: 'highlight',
          array: flattenBuckets(),
          highlightedIndices: [flatIdx],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 10,
          description: `Found ${deleteVal} in bucket ${bucketIdx} at position ${pos}`,
        });

        buckets[bucketIdx].splice(pos, 1);

        steps.push({
          type: 'remove',
          array: flattenBuckets(),
          highlightedIndices: getBucketIndices(bucketIdx),
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 10,
          description: `Deleted ${deleteVal} from bucket ${bucketIdx}`,
        });
      }
    }

    return steps;
  },
};
