import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { DataTable } from './DataTable';
import { PageHeader } from './PageHeader';
import { Modal, Button } from '@/components/ui';
import { ColumnDef, SortingState, OnChangeFn } from '@tanstack/react-table';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string;
  enableSorting?: boolean;
}

// Helper type to extract only keys with number values
type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

interface GenericMasterProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  keyField: NumberKeys<T>;
  onSave?: (item: T) => void;
  onDelete?: (id: number) => void;
  pageSize?: number;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  hideAddButton?: boolean;
  hideHeader?: boolean;
  renderForm?: (
    item: Partial<T> | null,
    onSave: (item: T) => void,
    onCancel: () => void
  ) => React.ReactNode;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  toolbarActions?: React.ReactNode;
}

export function GenericMaster<T>({
  title,
  data,
  columns,
  keyField,
  onSave,
  onDelete,
  pageSize = 10,
  modalSize = 'lg',
  onView,
  onEdit,
  hideAddButton = false,
  hideHeader = false,
  renderForm,
  sorting,
  onSortingChange,
  toolbarActions,
}: GenericMasterProps<T>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: T) => {
    if (onEdit) {
      // Use custom edit handler if provided
      onEdit(item);
    } else {
      // Default behavior: open modal
      setEditingItem(item);
      setIsFormOpen(true);
    }
  };

  const handleFormSave = (item: T) => {
    if (onSave) onSave(item);
    setIsFormOpen(false);
  };

  // Convert legacy columns to TanStack Table ColumnDef
  const tableColumns: ColumnDef<T>[] = React.useMemo(() => {
    const baseCols: ColumnDef<T>[] = columns.map(col => {
      if (typeof col.accessor === 'string') {
        // For string accessors, create a column with accessorKey
        return {
          header: col.header,
          accessorKey: col.accessor as string,
          enableSorting: col.enableSorting ?? true,
        } as ColumnDef<T>;
      } else {
        // For function accessors, use accessorFn
        return {
          header: col.header,
          accessorFn: col.accessor as (row: T) => any,
          cell: info => (col.accessor as (item: T) => React.ReactNode)(info.row.original),
          enableSorting: col.enableSorting ?? true,
        } as ColumnDef<T>;
      }
    });

    // Add Actions column
    baseCols.push({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center justify-end gap-2">
          {onView && (
            <button
              onClick={() => onView(info.row.original)}
              className="p-2 rounded-lg hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors border border-transparent hover:border-[var(--border)] focus-ring"
              title="View Details"
              aria-label="View Details"
            >
              <Eye size={16} />
            </button>
          )}
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-2 rounded-lg hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors border border-transparent hover:border-[var(--border)] focus-ring"
            title="Edit"
            aria-label="Edit"
          >
            <Edit2 size={16} />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(info.row.original[keyField] as number)}
              className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors border border-transparent hover:border-red-200 focus-ring"
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    });

    return baseCols;
  }, [columns, onDelete, onView, keyField]);

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {!hideHeader && (
          <PageHeader
            title={`${title} Master`}
            description={`Manage your ${title.toLowerCase()} records`}
            actions={
              !hideAddButton && (
                <Button variant="primary" onClick={handleAddNew} leftIcon={<Plus size={18} />}>
                  Add New {title}
                </Button>
              )
            }
          />
        )}

        <DataTable
          data={data}
          columns={tableColumns}
          searchPlaceholder={`Search ${title.toLowerCase()}...`}
          pageSize={pageSize}
          sorting={sorting}
          onSortingChange={onSortingChange}
          toolbarActions={toolbarActions}
        />
      </div>

      {/* Modal for Add/Edit Form */}
      {renderForm && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingItem ? `Edit ${title}` : `Add New ${title}`}
          size={modalSize}
        >
          {renderForm(editingItem, handleFormSave, () => setIsFormOpen(false))}
        </Modal>
      )}
    </>
  );
}
