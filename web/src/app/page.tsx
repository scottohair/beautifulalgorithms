import Link from 'next/link';

const algorithms = [
  {
    category: 'sorting',
    name: 'Sorting',
    items: [
      { id: 'bubble-sort', name: 'Bubble Sort', complexity: 'O(n²)' },
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
