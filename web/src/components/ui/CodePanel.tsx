import { GlassCard } from './GlassCard';

interface CodePanelProps {
  pseudocode: { line: number; text: string }[];
  currentLine: number;
}

export function CodePanel({ pseudocode, currentLine }: CodePanelProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="px-4 pt-3 pb-2 hidden md:block">
        <h3 className="text-[11px] font-semibold font-mono tracking-[0.15em] text-text-tertiary uppercase">
          Pseudocode
        </h3>
      </div>
      <div className="overflow-y-auto overflow-x-auto max-h-60 md:max-h-80">
        {pseudocode.map((item) => (
          <div
            key={item.line}
            className={`
              flex items-start px-4 py-1 text-[12px] md:text-[13px] font-mono transition-colors
              ${item.line === currentLine
                ? 'bg-accent-cyan/10 border-l-2 border-accent-cyan text-text-primary'
                : 'border-l-2 border-transparent text-text-secondary'
              }
            `}
          >
            <span className="w-8 text-right mr-3 text-text-tertiary select-none">
              {item.line + 1}
            </span>
            <span className="whitespace-pre">{item.text}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
