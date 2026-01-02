import React from 'react';
import { BarChart3 } from 'lucide-react';
import { DynamicChildDashboard } from '@/features/dashboard/components/DynamicChildDashboard';

const ReportsDashboard = () => {
  return (
    <DynamicChildDashboard
      parentPath="/reports"
      title="Reports & Analytics"
      description="View detailed reports, track performance, and analyze data."
      icon={BarChart3}
    />
  );
};

export default ReportsDashboard;
