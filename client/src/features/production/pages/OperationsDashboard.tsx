import React from 'react';
import { Factory } from 'lucide-react';
import { DynamicChildDashboard } from '@/features/dashboard/components/DynamicChildDashboard';

const OperationsDashboard = () => {
  return (
    <DynamicChildDashboard
      parentPath="/operations"
      title="Operations"
      description="Manage production flow, orders, batches, and daily operations."
      icon={Factory}
    />
  );
};

export default OperationsDashboard;
