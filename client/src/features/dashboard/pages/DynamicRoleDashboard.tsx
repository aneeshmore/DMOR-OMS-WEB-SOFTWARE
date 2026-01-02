import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { routeRegistry, findRouteByPath } from '@/config/routeRegistry';
import { Loader2 } from 'lucide-react';

export const DynamicRoleDashboard: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const { user } = useAuth();

  // Normalized role comparison could be added here if needed
  // For now, we trust the landing page config.

  // 1. Get the target path from the user's role configuration
  const landingPagePath = user?.landingPage || '/dashboard/admin';

  // 2. Find the route definition for that path
  const targetRoute = findRouteByPath(routeRegistry, landingPagePath);

  if (!targetRoute || !targetRoute.component) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Dashboard Configuration Error</h2>
        <p className="text-gray-600 mt-2">No valid dashboard found for path: {landingPagePath}</p>
        <p className="text-sm text-gray-400 mt-1">
          Please contact your administrator to configure your role&apos;s landing page.
        </p>
      </div>
    );
  }

  // 3. Render the component
  const Component = targetRoute.component;

  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};
