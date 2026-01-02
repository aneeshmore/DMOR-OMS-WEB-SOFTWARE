import React from 'react';
import { Database } from 'lucide-react';
import { DynamicChildDashboard } from '@/features/dashboard/components/DynamicChildDashboard';

const MastersDashboard = () => {
  return (
    <DynamicChildDashboard
      parentPath="/masters"
      title="Master Data"
      description="Manage core system data, definitions, and configurations."
      icon={Database}
    />
  );
};

export default MastersDashboard;
