import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { PageHeader } from '@/components/common';
import { KeyRound, RefreshCw, AlertTriangle } from 'lucide-react';
import { employeeApi } from '@/features/employees/api';
import { showToast } from '@/utils/toast';

interface ValidationTooltipProps {
  message: string;
  variant?: 'warning' | 'error';
}

const ValidationTooltip: React.FC<ValidationTooltipProps> = ({ message, variant = 'warning' }) => {
  const borderColor = variant === 'error' ? 'border-red-500/50' : 'border-orange-500/50';
  const iconBg = variant === 'error' ? 'bg-red-500' : 'bg-orange-500';

  return (
    <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in">
      <div
        className={`relative bg-[var(--surface)] text-[var(--text-primary)] text-sm rounded shadow-lg px-3 py-2 flex items-center gap-2 border ${borderColor}`}
      >
        {/* Triangle Arrow */}
        <div
          className={`absolute -top-1.5 left-4 w-3 h-3 bg-[var(--surface)] border-t border-l ${borderColor} transform rotate-45`}
        ></div>

        {/* Icon */}
        <div
          className={`${iconBg} rounded-sm text-white p-0.5 flex-shrink-0 flex items-center justify-center w-5 h-5`}
        >
          <AlertTriangle size={12} fill="white" className="text-white" />
        </div>

        {/* Message */}
        <span className="font-medium text-xs text-nowrap">{message}</span>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation State
  const [formErrors, setFormErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await employeeApi.getAll();
        if (response.success && response.data) {
          const userOptions = response.data.map(emp => ({
            value: emp.EmployeeID.toString(),
            label: `${emp.FirstName} ${emp.LastName || ''}`.trim(),
          }));
          setUsers(userOptions);
        }
      } catch (error) {
        console.error('Failed to load users', error);
      }
    };
    loadUsers();
  }, []);

  const handleReset = async () => {
    // Reset errors
    setFormErrors({});

    if (!selectedUser) {
      showToast.error('Please select a user');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setFormErrors({ newPassword: 'Password must be at least 8 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await employeeApi.update(Number(selectedUser), { Password: newPassword });

      if (response.success) {
        showToast.success('Password reset successfully');
        setNewPassword('');
        setConfirmPassword('');
        setSelectedUser('');
        setFormErrors({});
      } else {
        showToast.error('Failed to reset password');
      }
    } catch (error: any) {
      console.error('Password reset failed', error);
      showToast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader title="Reset Password" description="Force reset user passwords" />

      <div className="bg-[var(--surface)] p-6 rounded-lg shadow-sm border border-[var(--border)] max-w-md mx-auto mt-10">
        <div className="flex justify-center mb-6">
          <div className="bg-[var(--primary)]/10 p-4 rounded-full">
            <KeyRound size={32} className="text-[var(--primary)]" />
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Select User"
            options={users}
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            placeholder="Select user..."
          />

          <div className="relative">
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              maxLength={8}
              onChange={e => {
                const val = e.target.value;
                setNewPassword(val);
                // Real-time validation
                if (val && val.length < 8) {
                  setFormErrors(prev => ({
                    ...prev,
                    newPassword: 'Password must be at least 8 characters',
                  }));
                } else {
                  setFormErrors(prev => ({ ...prev, newPassword: undefined }));
                }
              }}
              placeholder="Enter new password"
            />
            {formErrors.newPassword && <ValidationTooltip message={formErrors.newPassword} />}
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              maxLength={8}
              onChange={e => {
                const val = e.target.value;
                setConfirmPassword(val);

                if (val && val !== newPassword) {
                  setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
                } else {
                  setFormErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              placeholder="Confirm new password"
            />
            {formErrors.confirmPassword && (
              <ValidationTooltip message={formErrors.confirmPassword} variant="error" />
            )}
          </div>

          <Button
            variant="primary"
            className="w-full justify-center mt-6"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RefreshCw size={16} className="mr-2" /> Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
