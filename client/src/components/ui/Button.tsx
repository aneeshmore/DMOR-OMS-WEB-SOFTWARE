import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'btn inline-flex items-center justify-center font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm border-transparent focus-visible:ring-[var(--primary)]',
    secondary:
      'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface-highlight)] hover:border-[var(--text-secondary)] focus-visible:ring-[var(--text-secondary)] shadow-sm',
    ghost:
      'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-highlight)] hover:text-[var(--text-primary)] border-transparent focus-visible:ring-[var(--text-secondary)]',
    danger:
      'bg-[var(--danger)] text-white hover:opacity-90 shadow-sm border-transparent focus-visible:ring-[var(--danger)]',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-md)]',
    md: 'h-9 px-4 text-sm gap-2 rounded-[var(--radius-md)]',
    lg: 'h-11 px-6 text-base gap-2.5 rounded-[var(--radius-lg)]',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {/* Ensure children are always wrapped in a flex-item span to maintain consistent layout */}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

Button.displayName = 'Button';
