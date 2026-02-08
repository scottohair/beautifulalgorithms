interface NeonBadgeProps {
  text: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
}

const colorMap = {
  cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20 shadow-accent-cyan/20',
  purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20 shadow-accent-purple/20',
  pink: 'text-accent-pink bg-accent-pink/10 border-accent-pink/20 shadow-accent-pink/20',
  green: 'text-accent-green bg-accent-green/10 border-accent-green/20 shadow-accent-green/20',
  orange: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20 shadow-accent-orange/20',
};

export function NeonBadge({ text, color = 'cyan' }: NeonBadgeProps) {
  return (
    <span
      className={`
        inline-block text-xs font-mono font-semibold tracking-wide
        px-2 py-0.5 rounded-full border shadow-sm
        ${colorMap[color]}
      `}
    >
      {text}
    </span>
  );
}
