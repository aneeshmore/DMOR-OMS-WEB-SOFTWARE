import React, { Suspense } from 'react';
import { RouteObject, Navigate, useRoutes } from 'react-router-dom';
import { routeRegistry, flattenRoutes, RouteNode } from '@/config/routeRegistry';
import { usePermission } from '@/hooks/usePermission';

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission?: { module: string };
}) => {
  const { hasPermission } = usePermission();

  // If route has permission requirement, check it
  if (permission?.module && !hasPermission(permission.module, 'view')) {
    // Return 403 Message
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 max-w-md">
          You do not have permission to view the <strong>{permission.module}</strong> module. Please
          contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

// Helper to convert Registry Node to Route Object
const convertToRouteObject = (node: RouteNode): RouteObject => {
  // Handle Redirects
  if (node.redirect) {
    return {
      path: node.path,
      element: <Navigate to={node.redirect} replace />,
    };
  }

  const route: RouteObject = {
    path: node.path,
  };

  // Handle Component Rendering
  if (node.component) {
    const Component = node.component;
    route.element = (
      <ProtectedRoute permission={node.permission}>
        <Suspense fallback={<PageLoader />}>
          <Component />
        </Suspense>
      </ProtectedRoute>
    );
  }

  // Handle Nested Routes
  if (node.children) {
    route.children = node.children.map(convertToRouteObject);
  }

  return route;
};

// Generate routes from registry
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  ...routeRegistry.map(convertToRouteObject),
  // Catch-all 404
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];
