import React from 'react';

interface BadgeProps {
  variant?: 'danger' | 'warning' | 'success' | 'info' | 'demo' | 'neutral';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  icon,
}) => {
  const styles: Record<string, string> = {
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    demo: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-wide ${styles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
