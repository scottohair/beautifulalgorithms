import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`
        rounded-xl border border-white/[0.08]
        bg-white/[0.03] backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
