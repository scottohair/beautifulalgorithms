import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

class ListNode {
  value: number;
  next: ListNode | null;

  constructor(value: number) {
    this.value = value;
    this.next = null;
  }
}

function toArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current) {
    result.push(current.value);
    current = current.next;
  }
  return result;
}

function findIndex(head: ListNode | null, target: ListNode): number {
  let index = 0;
  let current = head;
  while (current) {
    if (current === target) return index;
    index++;
    current = current.next;
  }
  return -1;
}

export const linkedList: AlgorithmImplementation = {
  id: 'linked-list',
  name: 'Linked List',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insertHead(value)' },
    { line: 1, text: '  node \u2190 new Node(value)' },
    { line: 2, text: '  node.next \u2190 head' },
    { line: 3, text: '  head \u2190 node' },
    { line: 4, text: 'procedure insertTail(value)' },
    { line: 5, text: '  traverse to last node' },
    { line: 6, text: '  last.next \u2190 new Node(value)' },
    { line: 7, text: 'procedure delete(value)' },
    { line: 8, text: '  find node with value' },
    { line: 9, text: '  prev.next \u2190 node.next' },
    { line: 10, text: 'procedure search(value)' },
    { line: 11, text: '  traverse until value found' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    let head: ListNode | null = null;

    if (input.length === 0) return steps;

    // Phase 1: Insert first half at head
    const headInsertCount = Math.max(1, Math.floor(input.length / 3));

    for (let i = 0; i < headInsertCount && i < input.length; i++) {
      const value = input[i];
      const newNode = new ListNode(value);
      newNode.next = head;
      head = newNode;

      steps.push({
        type: 'insert',
        array: toArray(head),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 3,
        description: `Insert ${value} at head`,
      });
    }

    // Phase 2: Insert next portion at tail
    const tailInsertEnd = Math.min(input.length, headInsertCount + Math.floor(input.length / 3));

    for (let i = headInsertCount; i < tailInsertEnd; i++) {
      const value = input[i];
      const newNode = new ListNode(value);

      if (!head) {
        head = newNode;
        steps.push({
          type: 'insert',
          array: toArray(head),
          highlightedIndices: [0],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 6,
          description: `Insert ${value} as first node`,
        });
      } else {
        // Traverse to the tail
        let current = head;
        const traversed: number[] = [];
        while (current.next) {
          traversed.push(findIndex(head, current));
          steps.push({
            type: 'traverse',
            array: toArray(head),
            highlightedIndices: [findIndex(head, current)],
            secondaryIndices: [...traversed.slice(0, -1)],
            sortedIndices: [],
            pseudocodeLine: 5,
            description: `Traversing: visiting node ${current.value}`,
          });
          current = current.next;
        }

        current.next = newNode;
        const arr = toArray(head);
        steps.push({
          type: 'insert',
          array: arr,
          highlightedIndices: [arr.length - 1],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 6,
          description: `Insert ${value} at tail`,
        });
      }
    }

    // Phase 3: Search for some values
    if (head) {
      const searchValue = input[0];
      let current: ListNode | null = head;
      const traversed: number[] = [];

      while (current) {
        const idx = findIndex(head, current);
        traversed.push(idx);

        steps.push({
          type: 'traverse',
          array: toArray(head),
          highlightedIndices: [idx],
          secondaryIndices: [...traversed.slice(0, -1)],
          sortedIndices: [],
          pseudocodeLine: 11,
          description: `Search: comparing ${current.value} with ${searchValue}`,
        });

        if (current.value === searchValue) {
          steps.push({
            type: 'highlight',
            array: toArray(head),
            highlightedIndices: [idx],
            secondaryIndices: [...traversed],
            sortedIndices: [],
            pseudocodeLine: 11,
            description: `Found ${searchValue} at position ${idx}`,
          });
          break;
        }

        current = current.next;
      }
    }

    // Phase 4: Delete the head node
    if (head) {
      const deletedValue = head.value;

      steps.push({
        type: 'highlight',
        array: toArray(head),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 8,
        description: `Found ${deletedValue} at head for deletion`,
      });

      head = head.next;

      steps.push({
        type: 'remove',
        array: toArray(head),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 9,
        description: `Deleted ${deletedValue} from list`,
      });
    }

    // Phase 5: Insert remaining elements at tail
    for (let i = tailInsertEnd; i < input.length; i++) {
      const value = input[i];
      const newNode = new ListNode(value);

      if (!head) {
        head = newNode;
      } else {
        let current = head;
        while (current.next) {
          current = current.next;
        }
        current.next = newNode;
      }

      const arr = toArray(head);
      steps.push({
        type: 'insert',
        array: arr,
        highlightedIndices: [arr.length - 1],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 6,
        description: `Insert ${value} at tail`,
      });
    }

    return steps;
  },
};
