import { Package } from 'lucide-react';
import { PageHeader } from '@/components/common';

export default function Production() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Production"
        description="Manage production batches and manufacturing processes"
      />

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Production Module</h3>
        <p className="mt-2 text-sm text-gray-500">Production management features coming soon</p>
      </div>
    </div>
  );
}
