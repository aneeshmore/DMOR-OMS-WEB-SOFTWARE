import { routes } from '@/router/routes';

export interface SubRoute {
  path: string;
  label: string;
}

export interface MainNavWithSubs {
  mainPath: string;
  subRoutes: SubRoute[];
}

/**
 * Automatically discovers sub-routes for main navigation items
 * by analyzing the routes configuration
 */
export function discoverSubRoutes(): Record<string, SubRoute[]> {
  const subRoutesMap: Record<string, SubRoute[]> = {
    '/dashboard': [],
    '/masters': [],
    '/operations': [],
    '/settings': [],
  };

  routes.forEach(route => {
    const path = route.path;
    if (!path || path === '/') return;

    // Check if this is a sub-route of any main nav item
    Object.keys(subRoutesMap).forEach(mainPath => {
      if (path.startsWith(mainPath + '/')) {
        // Extract the label from the path
        const segments = path.split('/');
        const lastSegment = segments[segments.length - 1];

        // Convert kebab-case to Title Case
        const label = lastSegment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        subRoutesMap[mainPath].push({
          path,
          label,
        });
      }
    });
  });

  return subRoutesMap;
}
