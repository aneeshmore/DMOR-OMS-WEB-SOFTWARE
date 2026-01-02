import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common';
import { ordersApi } from '../api/ordersApi';
import { Order } from '../types';
import { DataTable, DataTableColumnHeader } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { CreateOrderForm, ModeSwitcher, ModeIndicatorBanner, type ViewMode } from '../components';

const formatDisplayOrderId = (orderId: number, dateString: string) => {
  if (!dateString) return `ORD-${orderId}`;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const idStr = orderId.toString();
  const shortId = idStr.length > 3 ? idStr.slice(-3) : idStr.padStart(3, '0');
  return `ORD-${year}-${shortId}`;
};

const CreateOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('orders');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAll(100, 0);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSuccess = () => {
    fetchOrders();
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'orderId',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order No" />,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const index = orders.findIndex(o => o.orderId === row.original.orderId);
        const seq = orders.length - index;
        const displayId =
          row.original.orderNumber ||
          formatDisplayOrderId(row.original.orderId, row.original.orderDate);
        return (
          <div className="flex flex-col">
            <span className="font-mono font-medium text-[var(--primary)]">ODR-{seq}</span>
            <span className="text-xs text-[var(--text-secondary)]">{displayId}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'orderDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      enableColumnFilter: true,
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.orderDate), 'dd MMM yyyy');
        } catch {
          return row.original.orderDate;
        }
      },
    },
    {
      accessorKey: 'companyName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
      enableColumnFilter: true,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.companyName || row.original.customerName || 'Unknown'}
        </span>
      ),
    },
    {
      accessorKey: 'productNames',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Products" />,
      cell: ({ row }) => {
        if (!row.original.productNames) return <span className="text-muted-foreground">-</span>;
        const products = row.original.productNames.split(',').map(p => p.trim());
        return (
          <div className="flex flex-col gap-1 my-1">
            {products.slice(0, 2).map((product, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 bg-secondary/30 rounded text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                title={product}
              >
                {product}
              </span>
            ))}
            {products.length > 2 && (
              <span className="text-xs text-[var(--text-secondary)]">
                +{products.length - 2} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
        let className = '';
        switch (status) {
          case 'Delivered':
            className = 'bg-green-100 text-green-800 border-green-200';
            break;
          case 'Dispatched':
            className = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            break;
          case 'Ready for Dispatch':
            className = 'bg-blue-100 text-blue-800 border-blue-200';
            break;
          case 'Scheduled for Production':
          case 'In Production':
            className = 'bg-purple-100 text-purple-800 border-purple-200';
            break;
          case 'Confirmed':
          case 'Accepted':
            className = 'bg-teal-100 text-teal-800 border-teal-200';
            break;
          case 'Cancelled':
          case 'Rejected':
            variant = 'destructive';
            break;
          case 'Pending':
            className = 'bg-orange-100 text-orange-800 border-orange-200';
            break;
          default:
            variant = 'secondary';
        }
        return (
          <Badge variant={variant} className={className}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" className="justify-end" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.original.totalAmount?.toString() || '0');
        return <div className="text-right font-medium">₹{amount.toFixed(2)}</div>;
      },
    },
  ];

  return (
    <div className="container mx-auto pb-10">
      <div className="space-y-6 animate-fade-in">
        {/* Header with Mode Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title={viewMode === 'orders' ? 'Create New Order' : 'Create Quotation'}
            description={
              viewMode === 'orders'
                ? 'Fill in the order details and confirm to create a new order'
                : 'Create quotations for customer approval before placing orders'
            }
          />

          <div className="flex items-center justify-center">
            <ModeSwitcher viewMode={viewMode} onModeChange={setViewMode} />
          </div>
        </div>

        {/* Mode Indicator Banner
        <ModeIndicatorBanner viewMode={viewMode} /> */}

        {/* Form Component */}
        <CreateOrderForm onSuccess={handleSuccess} viewMode={viewMode} />

        {/* Orders Table - Only show in orders mode */}
        {viewMode === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recent Orders</h2>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center p-8 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[var(--text-secondary)]">Loading orders...</span>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                <DataTable columns={columns} data={orders} searchPlaceholder="Search orders..." />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrderPage;
