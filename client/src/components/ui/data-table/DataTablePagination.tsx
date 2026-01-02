import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  showSelectedCount?: boolean;
  className?: string;
}

export function DataTablePagination<TData>({
  table,
  showSelectedCount = true,
  className,
}: DataTablePaginationProps<TData>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* Selected count - hidden on very small screens */}
      {showSelectedCount && (
        <div className="text-sm text-[var(--text-secondary)] text-center sm:text-left sm:flex-1">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
        {/* Rows per page - stacked on mobile */}
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <p className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">Rows</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-8 w-[70px] rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] px-2 py-1 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
          >
            {[10, 20, 30, 40, 50, 100].map(pageSize => (
              <option
                key={pageSize}
                value={pageSize}
                className="bg-[var(--surface)] text-[var(--text-primary)]"
              >
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        {/* Page info and navigation buttons - centered row on mobile */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Page indicator */}
          <div className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
            <span className="hidden sm:inline">Page </span>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            {/* First page - hidden on mobile */}
            <button
              className="hidden sm:inline-flex h-8 w-8 p-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title="Go to first page"
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Previous page */}
            <button
              className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Go to previous page"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Next page */}
            <button
              className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Go to next page"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last page - hidden on mobile */}
            <button
              className="hidden sm:inline-flex h-8 w-8 p-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title="Go to last page"
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
