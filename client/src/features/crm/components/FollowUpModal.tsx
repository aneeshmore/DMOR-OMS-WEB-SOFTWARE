import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@/components/ui';
import { Visit } from '../types';
import { showToast } from '@/utils/toast';
import { crmApi } from '../api/crmApi';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
  onUpdate: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  visit,
  onUpdate,
}) => {
  const [date, setDate] = useState('');

  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const PURPOSES = [
    { value: 'Order', label: 'Order' },
    { value: 'Complaint', label: 'Complaint' },
    { value: 'New Customer', label: 'New Customer' },
    { value: 'Payment', label: 'Payment' },
  ];

  useEffect(() => {
    if (visit) {
      setDate(visit.nextVisitDate ? new Date(visit.nextVisitDate).toISOString().split('T')[0] : '');

      setPurpose(visit.purpose || 'Order');
    }
  }, [visit]);

  const handleSave = async () => {
    if (!visit) return;
    if (!date) {
      showToast.error('Please select a date');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        isNextVisitRequired: true,
        nextVisitDate: new Date(date).toISOString(),

        purpose: purpose,
      } as any;
      console.log('FollowUpModal: Updating visit', visit.visitId, payload);
      await crmApi.updateVisit(visit.visitId, payload);
      showToast.success('Follow up updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update follow up', error);
      showToast.error('Failed to update follow up');
    } finally {
      setLoading(false);
    }
  };

  if (!visit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Follow Up">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Visit Purpose</label>
          <div className="flex flex-wrap gap-2">
            {PURPOSES.map(p => (
              <button
                type="button"
                key={p.value}
                onClick={() => setPurpose(p.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  purpose === p.value
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Next Follow-up Date"
          type="date"
          min={new Date().toISOString().split('T')[0]}
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Update'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
