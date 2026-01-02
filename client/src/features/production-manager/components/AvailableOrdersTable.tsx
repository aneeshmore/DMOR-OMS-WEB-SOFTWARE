import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface OrderWithDetails {
  order: {
    orderId: number;
    orderNumber: string;
    orderDate: string;
    // ... other order fields
  };
  customer: {
    companyName: string;
    city?: string;
  };
  productCount?: number;
  isEligibleForBatch?: boolean;
  hasRawMaterials?: boolean;
}

interface AvailableOrdersTableProps {
  data: OrderWithDetails[];
  onAddOrder: (order: OrderWithDetails) => void;
  addedOrderIds: number[];
}

export function AvailableOrdersTable({
  data,
  onAddOrder,
  addedOrderIds,
}: AvailableOrdersTableProps) {
  const columns: ColumnDef<OrderWithDetails>[] = useMemo(
    () => [
      {
        accessorKey: 'order.orderNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
        cell: ({ row }) => {
          const val = row.original.order.orderNumber || row.original.order.orderId;
          return <span className="font-medium">{val}</span>;
        },
      },
      {
        accessorKey: 'customer.companyName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-[var(--text-primary)]">
              {row.original.customer?.companyName || 'Unknown'}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {row.original.customer?.city || '-'}
            </div>
          </div>
        ),
      },
      {
        id: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const item = row.original;
          const productCount = item.productCount || 0;
          const hasProducts = productCount > 0;
          const isEligible = item.isEligibleForBatch !== false;
          const hasRawMaterials = item.hasRawMaterials;

          if (hasProducts && isEligible) {
            return (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Ready ({productCount} items)
              </Badge>
            );
          }
          if (hasRawMaterials) {
            return (
              <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Raw Materials
              </Badge>
            );
          }
          if (!hasProducts) {
            return <Badge variant="secondary">No Products</Badge>;
          }
          return (
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Not Eligible
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          const item = row.original;
          const orderId = item.order.orderId;
          const isAdded = addedOrderIds.includes(orderId);
          const productCount = item.productCount || 0;
          const hasProducts = productCount > 0;
          const isEligible = item.isEligibleForBatch !== false;

          return (
            <Button
              size="sm"
              onClick={() => onAddOrder(item)}
              disabled={isAdded || !hasProducts || !isEligible}
              variant={isAdded ? 'secondary' : 'primary'}
              className="w-full sm:w-auto"
            >
              {isAdded ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Added
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          );
        },
      },
    ],
    [onAddOrder, addedOrderIds]
  );

  // Filter out orders that are already added if we wanted, but logic says we pass addedOrderIds to disable/mark them.
  // Actually, standard practice is to show them but disabled or marked.

  return (
    <DataTable columns={columns} data={data} searchPlaceholder="Search orders..." showPagination />
  );
}
