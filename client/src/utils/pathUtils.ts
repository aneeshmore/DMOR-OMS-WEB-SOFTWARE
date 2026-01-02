/**
 * Get the parent path from a given path
 * Example: /masters/departments -> /masters
 * Example: /operations/production -> /operations
 * Example: /dashboard -> /dashboard (no parent, stays same)
 */
export function getParentPath(currentPath: string): string {
  // Remove trailing slash if exists
  const cleanPath =
    currentPath.endsWith('/') && currentPath.length > 1 ? currentPath.slice(0, -1) : currentPath;

  // Split the path into segments
  const segments = cleanPath.split('/').filter(Boolean);

  // If we're at root or only one level deep, return root or same path
  if (segments.length <= 1) {
    return currentPath;
  }

  // Remove the last segment to get parent
  segments.pop();

  // Return the parent path
  return '/' + segments.join('/');
}

/**
 * Check if a path has a parent (is not at root level)
 */
export function hasParentPath(currentPath: string): boolean {
  const cleanPath =
    currentPath.endsWith('/') && currentPath.length > 1 ? currentPath.slice(0, -1) : currentPath;

  const segments = cleanPath.split('/').filter(Boolean);
  return segments.length > 1;
}
