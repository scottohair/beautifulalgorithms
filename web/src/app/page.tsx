import Link from 'next/link';

const algorithms = [
  {
    category: 'sorting',
    name: 'Sorting',
    items: [
      { id: 'bubble-sort', name: 'Bubble Sort', complexity: 'O(n²)' },
      { id: 'insertion-sort', name: 'Insertion Sort', complexity: 'O(n²)' },
      { id: 'selection-sort', name: 'Selection Sort', complexity: 'O(n²)' },
      { id: 'merge-sort', name: 'Merge Sort', complexity: 'O(n log n)' },
      { id: 'quick-sort', name: 'Quick Sort', complexity: 'O(n log n)' },
      { id: 'heap-sort', name: 'Heap Sort', complexity: 'O(n log n)' },
    ],
  },
  {
    category: 'data-structures',
    name: 'Data Structures',
    items: [
      { id: 'stack', name: 'Stack', complexity: 'O(1)' },
      { id: 'queue', name: 'Queue', complexity: 'O(1)' },
      { id: 'bst', name: 'Binary Search Tree', complexity: 'O(log n)' },
      { id: 'linked-list', name: 'Linked List', complexity: 'O(n)' },
      { id: 'avl-tree', name: 'AVL Tree', complexity: 'O(log n)' },
      { id: 'hash-table', name: 'Hash Table', complexity: 'O(1)' },
    ],
  },
  {
    category: 'graph',
    name: 'Graph',
    items: [
      { id: 'bfs', name: 'Breadth-First Search', complexity: 'O(V+E)' },
      { id: 'dfs', name: 'Depth-First Search', complexity: 'O(V+E)' },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-text-primary mb-2 tracking-tight">
          Aesthetic Algorithm
        </h1>
        <p className="text-text-secondary mb-12">
          Beautiful visualizations of computer science algorithms
        </p>

        {algorithms.map((cat) => (
          <section key={cat.category} className="mb-12">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-text-tertiary uppercase mb-4 font-mono">
              {cat.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((algo) => (
                <Link
                  key={algo.id}
                  href={`/algorithms/${cat.category}/${algo.id}`}
                  className="group relative rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-accent-cyan/5"
                >
                  <h3 className="text-base font-medium text-text-primary mb-1">
                    {algo.name}
                  </h3>
                  <span className="inline-block text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                    {algo.complexity}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
