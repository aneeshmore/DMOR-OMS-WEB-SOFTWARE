import React from 'react';
import { Visit } from '../types';
import { Modal } from '@/components/ui';
import { Calendar, Clock, User, FileText, Info } from 'lucide-react';

interface VisitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
}

export const VisitDetailsModal: React.FC<VisitDetailsModalProps> = ({ isOpen, onClose, visit }) => {
  if (!visit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visit Details">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-start justify-between bg-[var(--surface-highlight)] p-4 rounded-lg">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {visit.customer?.companyName || 'Unknown Customer'}
            </h3>
            <div className="text-sm text-[var(--text-secondary)] mt-1">
              {visit.customer?.contactPerson && (
                <span className="flex items-center gap-1">
                  <User size={14} /> {visit.customer.contactPerson}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
              <Calendar size={16} />
              {new Date(visit.visitDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">
              Sales Exec: {visit.salesExecutive?.firstName} {visit.salesExecutive?.lastName}
            </div>
          </div>
        </div>

        {/* Purpose & Notes */}
        <div className="grid grid-cols-1 gap-4">
          <div className="card p-4 border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--primary)] font-medium">
              <Info size={18} />
              <h4>Purpose</h4>
            </div>
            <p className="text-[var(--text-primary)]">{visit.purpose}</p>
          </div>

          <div className="card p-4 border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--primary)] font-medium">
              <FileText size={18} />
              <h4>Notes / Remarks</h4>
            </div>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{visit.notes}</p>
          </div>
        </div>

        {/* Next Follow Up Section */}
        {visit.nextVisitDate && (
          <div className="card p-4 border-l-4 border-l-[var(--warning)] bg-orange-50">
            <h4 className="flex items-center gap-2 text-[var(--warning-dark)] font-bold mb-3">
              <Clock size={18} />
              Upcoming Follow-up
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                  Date
                </label>
                <p className="text-[var(--text-primary)] font-medium">
                  {new Date(visit.nextVisitDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[var(--surface-highlight)] hover:bg-[var(--border)] text-[var(--text-primary)] rounded-md transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
