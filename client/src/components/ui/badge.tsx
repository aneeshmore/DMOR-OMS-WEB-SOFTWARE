import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variantClasses =
    variant === 'default'
      ? 'border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80'
      : variant === 'secondary'
        ? 'border-transparent bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
        : variant === 'destructive'
          ? 'border-transparent bg-red-500 text-white hover:bg-red-500/80'
          : 'text-[var(--foreground)] border-[var(--border)]';

  return (
    <div className={cn(baseClasses, variantClasses, className)} {...props}>
      {children}
    </div>
  );
};
