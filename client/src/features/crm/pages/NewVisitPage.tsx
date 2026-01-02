import React from 'react';
import { VisitForm } from '../components/VisitForm';
import { PageHeader } from '@/components/common';

export const NewVisitPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Client Visit"
        description="Record details of your client visit"
        showBackButton
      />
      <VisitForm />
    </div>
  );
};
