import React, { useState } from 'react';
import { Button, Select } from '@/components/ui';
import { PageHeader } from '@/components/common';
import { Lock, Unlock, UserX } from 'lucide-react';
import { employeeApi } from '@/features/employees/api';
import { Employee } from '@/features/employees/types';
import { showToast } from '@/utils/toast';

const LockUserPage = () => {
  const [allUsers, setAllUsers] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await employeeApi.getAll();
      if (response.success && response.data) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users', error);
    }
  };

  const handleLockUnlock = async (action: 'lock' | 'unlock') => {
    if (!selectedUser) {
      showToast.error('Please select a user');
      return;
    }
    setIsLoading(true);

    try {
      const userId = parseInt(selectedUser);
      const user = allUsers.find(u => u.EmployeeID === userId);

      if (user) {
        // Optimistic update
        const newStatus = action === 'lock' ? 'Locked' : 'Active';

        // Call API
        await employeeApi.update(userId, { ...user, Status: newStatus });

        setAllUsers(prev =>
          prev.map(u => (u.EmployeeID === userId ? { ...u, Status: newStatus as any } : u))
        );

        showToast.success(`User successfully ${action}ed`);
        setSelectedUser('');
      }
    } catch (error) {
      console.error('Failed to update user status', error);
      showToast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const lockedUsers = allUsers.filter(u => u.Status === 'Locked');
  // Filter out users who are already locked from the dropdown to avoid confusion
  const userOptions = allUsers
    .filter(u => u.Status !== 'Locked')
    .map(emp => ({
      value: emp.EmployeeID.toString(),
      label: `${emp.FirstName} ${emp.LastName || ''} (${emp.Role || 'User'})`.trim(),
    }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader title="Lock User" description="Manage user access status" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lock Action Card */}
        <div className="bg-[var(--surface)] p-6 rounded-lg shadow-sm border border-[var(--border)] h-fit">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Lock size={20} className="text-red-500" />
            Lock Access
          </h2>
          <div className="space-y-6">
            <Select
              label="Select User to Lock"
              options={userOptions}
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
              placeholder="Select user..."
            />

            <Button
              variant="danger"
              className="w-full justify-center"
              onClick={() => handleLockUnlock('lock')}
              disabled={isLoading || !selectedUser}
            >
              <Lock size={16} className="mr-2" /> Lock User
            </Button>
          </div>
        </div>

        {/* Locked Users Table */}
        <div className="bg-[var(--surface)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-hover)] flex justify-between items-center">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <UserX size={18} />
              Locked Users
            </h3>
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
              {lockedUsers.length} Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--surface-hover)] text-[var(--text-secondary)] font-medium border-b border-[var(--border)]">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {lockedUsers.length > 0 ? (
                  lockedUsers.map(user => (
                    <tr key={user.EmployeeID} className="hover:bg-[var(--surface-hover)]">
                      <td className="p-3 font-medium text-[var(--text-primary)]">
                        {user.FirstName} {user.LastName}
                      </td>
                      <td className="p-3 text-[var(--text-secondary)]">{user.Role}</td>
                      <td className="p-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            // Optimistic unlock
                            employeeApi.update(user.EmployeeID, { ...user, Status: 'Active' });
                            setAllUsers(prev =>
                              prev.map(u =>
                                u.EmployeeID === user.EmployeeID
                                  ? { ...u, Status: 'Active' as any }
                                  : u
                              )
                            );
                            showToast.success('User unlocked');
                          }}
                          className="h-8 text-xs"
                        >
                          <Unlock size={14} className="mr-1" /> Unlock
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-[var(--text-secondary)]">
                      No locked users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockUserPage;
