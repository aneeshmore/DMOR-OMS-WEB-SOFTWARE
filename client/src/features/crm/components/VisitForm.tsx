import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { crmApi } from '../api/crmApi';
import { customerApi } from '@/features/masters/api/customerApi';
import { Input, Button, Select } from '@/components/ui';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { showToast } from '@/utils/toast';
import { CreateVisitDTO } from '../types';
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  User,
  ClipboardList,
  AlertCircle,
  Phone,
  Star,
  XCircle,
  FileText,
  CheckCircle,
  Users,
} from 'lucide-react';

const PURPOSES = [
  { value: 'Order', label: 'Order' },
  { value: 'Complaint', label: 'Complaint' },
  { value: 'New Customer', label: 'New Customer' },
  { value: 'Payment', label: 'Payment' },
];

const LEAD_STATUSES = [
  {
    value: 'Contacted',
    label: 'Contacted',
    icon: Phone,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'Follow Up',
    label: 'Follow Up',
    icon: Clock,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'Important',
    label: 'Important',
    icon: Star,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'Irrelevant',
    label: 'Irrelevant',
    icon: XCircle,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'Quotation Status',
    label: 'Quotation Status',
    icon: FileText,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'Deal Done',
    label: 'Deal Done',
    icon: CheckCircle,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'Negotiation',
    label: 'Negotiation',
    icon: Users,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
];

export const VisitForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<{ id: number; label: string; value: number }[]>([]);

  const [formData, setFormData] = useState<CreateVisitDTO>({
    visitDate: new Date().toISOString().split('T')[0], // Default today
    customerId: 0,
    visitType: 'New Visit',
    purpose: 'Order',
    leadStatus: 'Contacted',
    notes: '',
    isNextVisitRequired: false,
    nextVisitDate: '',
  });

  useEffect(() => {
    loadCustomers();

    // Handle pre-filled state (e.g. from "Complete Follow Up")
    if (location.state) {
      const { customerId, visitType, notes } = location.state;
      setFormData(prev => ({
        ...prev,
        customerId: customerId || 0,
        visitType: visitType || 'New Visit',
        notes: notes || '',
      }));
    }
  }, [location.state]);

  const loadCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      if (response.success && response.data) {
        setCustomers(
          response.data.map((c: any) => ({
            id: c.CustomerID,
            value: c.CustomerID,
            label: `${c.CompanyName} (${c.ContactPerson || 'No Contact'})`,
            subLabel: c.Location,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load customers', error);
      showToast.error('Failed to load customers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      showToast.error('Please select a customer');
      return;
    }
    if (!formData.notes) {
      showToast.error('Please enter visit notes');
      return;
    }

    try {
      setLoading(true);
      await crmApi.createVisit(formData);
      showToast.success('Visit recorded successfully');
      navigate('/crm'); // Redirect to CRM dashboard
    } catch (error) {
      console.error('Failed to save visit', error);
      showToast.error('Failed to save visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Section 1: Visit Details */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
          <User className="text-[var(--primary)]" size={20} />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Visit Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Visit Date"
            type="date"
            value={formData.visitDate}
            onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
            required
            // Removed unsupported icon prop
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Sales Executive
            </label>
            <div className="input bg-[var(--surface-hover)] text-[var(--text-primary)] opacity-75 cursor-not-allowed">
              {user?.FirstName} {user?.LastName}
            </div>
          </div>

          <div className="md:col-span-2">
            <SearchableSelect
              label="Customer Name"
              options={customers}
              value={formData.customerId || undefined}
              onChange={val => setFormData({ ...formData, customerId: Number(val) })}
              placeholder="Search Customer..."
              required
            />
          </div>
        </div>
      </div>

      {/* Section 2: Visit Purpose */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
          <ClipboardList className="text-[var(--primary)]" size={20} />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Visit Purpose</h3>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Purpose</label>
          <div className="flex flex-wrap gap-3">
            {PURPOSES.map(p => (
              <button
                type="button"
                key={p.value}
                onClick={() => setFormData({ ...formData, purpose: p.value })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  formData.purpose === p.value
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2.5: Lead Status (New Feature) */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
          <Star className="text-[var(--primary)]" size={20} />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Lead Status</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LEAD_STATUSES.map(status => {
            const Icon = status.icon;
            const currentStatuses = formData.leadStatus
              ? formData.leadStatus.split(', ').filter(Boolean)
              : [];
            const isButtonSelected = currentStatuses.includes(status.value);

            return (
              <button
                type="button"
                key={status.value}
                onClick={() => {
                  let nextStatuses;
                  if (isButtonSelected) {
                    nextStatuses = currentStatuses.filter(s => s !== status.value);
                  } else {
                    nextStatuses = [...currentStatuses, status.value];
                  }
                  setFormData({ ...formData, leadStatus: nextStatuses.join(', ') });
                }}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                  ${isButtonSelected ? status.color + ' border-current shadow-md scale-[1.02]' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}
                `}
              >
                <div
                  className={`p-2 rounded-full ${isButtonSelected ? 'bg-white/50' : 'bg-gray-100'}`}
                >
                  <Icon size={24} />
                </div>
                <span className="text-sm font-bold text-center leading-tight">{status.label}</span>
                {isButtonSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Visit Notes */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
          <ClipboardList className="text-[var(--primary)]" size={20} />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Visit Notes</h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Remarks / Discussion Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            className="input min-h-[100px] py-2 resize-y"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Example: Dealer needs 10 drums of exterior emulsion"
            required
          />
        </div>
      </div>

      {/* Section 4: Next Visit / Follow-up */}
      <div className="card p-6 space-y-6 border-t-4 border-t-[var(--warning)]">
        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
          <Clock className="text-[var(--warning)]" size={20} />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Next Visit / Follow-up
          </h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Next Visit Required?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nextVisit"
                  checked={formData.isNextVisitRequired}
                  onChange={() => setFormData({ ...formData, isNextVisitRequired: true })}
                  className="accent-[var(--primary)] w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nextVisit"
                  checked={!formData.isNextVisitRequired}
                  onChange={() => setFormData({ ...formData, isNextVisitRequired: false })}
                  className="accent-[var(--primary)] w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {formData.isNextVisitRequired && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 fade-in duration-300">
              <Input
                label="Next Visit Date 📅"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.nextVisitDate}
                onChange={e => setFormData({ ...formData, nextVisitDate: e.target.value })}
                required={formData.isNextVisitRequired}
                className="border-[var(--warning)] focus:ring-[var(--warning)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 sticky bottom-4 z-10 bg-[var(--background)] p-4 rounded-lg shadow-lg border border-[var(--border)]">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading} leftIcon={<Save size={18} />}>
          {loading
            ? 'Saving...'
            : formData.isNextVisitRequired
              ? 'Save Visit + Set Reminder'
              : 'Save Visit'}
        </Button>
      </div>
    </form>
  );
};
