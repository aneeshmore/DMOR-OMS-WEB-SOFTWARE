import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2
          ${checked ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <span className={`text-sm ${disabled ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
        {checked ? 'Hardener' : 'Base'}
      </span>
    </div>
  );
};

export default Toggle;
