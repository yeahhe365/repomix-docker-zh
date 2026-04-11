import type { Context } from 'hono';
import { listLocalPathDirectories } from '../domains/pack/localPath.js';
import { createErrorResponse } from '../utils/http.js';
import { logError } from '../utils/logger.js';

export const localPathBrowseAction = async (c: Context) => {
  try {
    const selectedPath = c.req.query('path');
    const listing = await listLocalPathDirectories(selectedPath || undefined);
    return c.json(listing);
  } catch (error) {
    logError('Local path browse failed', error instanceof Error ? error : new Error('Unknown error'), {
      requestId: c.get('requestId'),
    });

    const { handlePackError } = await import('../utils/errorHandler.js');
    const appError = handlePackError(error);
    return c.json(createErrorResponse(appError.message, c.get('requestId')), appError.statusCode);
  }
};
