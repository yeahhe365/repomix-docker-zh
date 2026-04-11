import { describe, expect, it } from 'vitest';
import {
  buildLocalPathBreadcrumbs,
  filterLocalPathEntries,
  moveLocalPathSelection,
  pushRecentLocalPath,
} from '../../website/client/components/Home/localPathBrowserNavigation.js';

describe('localPathBrowserNavigation', () => {
  it('builds clickable breadcrumbs for the current absolute path', () => {
    expect(buildLocalPathBreadcrumbs('/Users/jones/Desktop')).toEqual([
      { label: 'Users', path: '/Users' },
      { label: 'jones', path: '/Users/jones' },
      { label: 'Desktop', path: '/Users/jones/Desktop' },
    ]);
  });

  it('returns an empty breadcrumb list for the root browser view', () => {
    expect(buildLocalPathBreadcrumbs(null)).toEqual([]);
  });

  it('moves selection down and clamps to the final entry', () => {
    expect(moveLocalPathSelection(0, 3, 'next')).toBe(1);
    expect(moveLocalPathSelection(2, 3, 'next')).toBe(2);
  });

  it('moves selection up and clamps to the first entry', () => {
    expect(moveLocalPathSelection(2, 3, 'previous')).toBe(1);
    expect(moveLocalPathSelection(0, 3, 'previous')).toBe(0);
  });

  it('keeps selection empty when there are no entries', () => {
    expect(moveLocalPathSelection(-1, 0, 'next')).toBe(-1);
  });

  it('filters directory entries by a case-insensitive query', () => {
    expect(
      filterLocalPathEntries(
        [
          { name: 'Desktop', path: '/Users/jones/Desktop' },
          { name: 'Documents', path: '/Users/jones/Documents' },
          { name: 'Downloads', path: '/Users/jones/Downloads' },
        ],
        'doc',
      ),
    ).toEqual([{ name: 'Documents', path: '/Users/jones/Documents' }]);
  });

  it('keeps a bounded MRU list for recent directories', () => {
    expect(
      pushRecentLocalPath(
        ['/Users/jones/Desktop', '/Users/jones/Documents'],
        '/Users/jones/Downloads',
        3,
      ),
    ).toEqual(['/Users/jones/Downloads', '/Users/jones/Desktop', '/Users/jones/Documents']);

    expect(
      pushRecentLocalPath(
        ['/Users/jones/Desktop', '/Users/jones/Documents', '/Users/jones/Downloads'],
        '/Users/jones/Desktop',
        3,
      ),
    ).toEqual(['/Users/jones/Desktop', '/Users/jones/Documents', '/Users/jones/Downloads']);
  });
});
