import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const DashboardRedirect: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait for auth to finish loading

    if (!isAuthenticated || !user) {
      // Not logged in - redirect to login
      navigate('/login', { replace: true });
      return;
    }

    // Use user's configured landing page, or fallback to role-based dashboard
    if (user.landingPage) {
      navigate(user.landingPage, { replace: true });
    } else {
      // Fallback: redirect to role-specific dashboard
      const roleName = user.Role || 'unknown';
      const roleSlug = roleName.toLowerCase().replace(/\s+/g, '-');
      navigate(`/dashboard/${roleSlug}`, { replace: true });
    }
  }, [user, loading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)] mx-auto mb-4" />
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    </div>
  );
};
