export interface LocalPathBreadcrumb {
  label: string;
  path: string;
}

export function buildLocalPathBreadcrumbs(currentPath: string | null): LocalPathBreadcrumb[] {
  if (!currentPath) {
    return [];
  }

  const segments = currentPath.split('/').filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment,
    path: `/${segments.slice(0, index + 1).join('/')}`,
  }));
}

export function moveLocalPathSelection(
  currentIndex: number,
  entryCount: number,
  direction: 'next' | 'previous',
): number {
  if (entryCount <= 0) {
    return -1;
  }

  if (currentIndex < 0) {
    return direction === 'next' ? 0 : entryCount - 1;
  }

  if (direction === 'next') {
    return Math.min(currentIndex + 1, entryCount - 1);
  }

  return Math.max(currentIndex - 1, 0);
}
