import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function DataTableViewOptions<TData>({
  table,
  className,
}: DataTableViewOptionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden ml-2 h-8 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 lg:flex transition-colors"
      >
        <Settings2 className="h-4 w-4" />
        View
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-[9999] mt-2 w-[180px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg animate-fade-in">
          <div className="mb-2 px-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            Toggle columns
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {table
              .getAllColumns()
              .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
              .map(column => {
                return (
                  <div
                    key={column.id}
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-[var(--surface-highlight)] transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`col-${column.id}`}
                      className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                      checked={column.getIsVisible()}
                      onChange={e => column.toggleVisibility(!!e.target.checked)}
                    />
                    <label
                      htmlFor={`col-${column.id}`}
                      className="cursor-pointer text-sm capitalize text-[var(--text-primary)] flex-1"
                    >
                      {column.id}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
