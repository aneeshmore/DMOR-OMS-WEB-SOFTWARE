import { Column } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  Group,
  Pin,
  PinOff,
  Ungroup,
  AlignLeft,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useState, useRef, useEffect } from 'react';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
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

  if (!column.getCanSort() && !column.getCanGroup() && !column.getCanPin()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2 relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-8 items-center rounded-md px-2 text-sm font-medium transition-colors hover:bg-[var(--primary)]/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]',
          isOpen ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--text-secondary)]'
        )}
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-dropdown mt-2 w-48 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg animate-fade-in text-[var(--text-primary)]">
          {column.getCanSort() && (
            <>
              <button
                onClick={() => {
                  column.toggleSorting(false);
                  setIsOpen(false);
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
              >
                <ArrowUp className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70" />
                Asc
              </button>
              <button
                onClick={() => {
                  column.toggleSorting(true);
                  setIsOpen(false);
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
              >
                <ArrowDown className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70" />
                Desc
              </button>
              <div className="my-1 h-px bg-[var(--border)]" />
            </>
          )}

          {column.getCanGroup() && (
            <>
              {column.getIsGrouped() ? (
                <button
                  onClick={() => {
                    column.toggleGrouping();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
                >
                  <Ungroup className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70" />
                  Ungroup
                </button>
              ) : (
                <button
                  onClick={() => {
                    column.toggleGrouping();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
                >
                  <Group className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70" />
                  Group
                </button>
              )}
              <div className="my-1 h-px bg-[var(--border)]" />
            </>
          )}

          {column.getCanPin() && (
            <>
              {column.getIsPinned() ? (
                <button
                  onClick={() => {
                    column.pin(false);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
                >
                  <PinOff className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70" />
                  Unpin
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      column.pin('left');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
                  >
                    <Pin className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70" />
                    Pin Left
                  </button>
                  <button
                    onClick={() => {
                      column.pin('right');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
                  >
                    <AlignLeft className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70 rotate-180" />
                    Pin Right
                  </button>
                </>
              )}
              <div className="my-1 h-px bg-[var(--border)]" />
            </>
          )}

          {column.getCanHide() && (
            <button
              onClick={() => {
                column.toggleVisibility(false);
                setIsOpen(false);
              }}
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)]"
            >
              <EyeOff className="mr-2 h-3.5 w-3.5 text-[var(--text-secondary)]/70" />
              Hide
            </button>
          )}
        </div>
      )}
    </div>
  );
}
