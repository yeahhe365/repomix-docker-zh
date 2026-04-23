import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockHandlePackRequest = vi.fn();
const mockSaveTryItPageState = vi.fn();

vi.mock('../../../website/client/components/utils/requestHandlers', () => ({
  handlePackRequest: mockHandlePackRequest,
}));

vi.mock('../../../website/client/components/Home/useHomeUiText', () => {
  return {
    useHomeUiText: () => ({
      value: {
        errors: {
          requestTimedOut: 'Request timed out.',
          requestCancelled: 'Request was cancelled.',
          requestCancelledUnknown: 'Request was cancelled with an unknown reason.',
          unexpectedError: 'An unexpected error occurred',
        },
      },
    }),
  };
});

vi.mock('../../../website/client/components/utils/validation', () => ({
  isValidRemoteValue: (value: string) => value.trim().length > 0,
}));

vi.mock('../../../website/client/components/Home/localPathInput', () => ({
  isValidAbsolutePath: (value: string) => value.startsWith('/'),
}));

vi.mock('../../../website/client/utils/urlParams', () => ({
  parseUrlParameters: () => ({}),
}));

vi.mock('../../../website/client/utils/tryItPersistence', () => ({
  loadTryItPageState: () => null,
  resolveInitialTryItPageState: ({ defaultOptions }: { defaultOptions: Record<string, unknown> }) => ({
    mode: 'url',
    remoteUrl: '',
    localPath: '',
    packOptions: { ...defaultOptions },
  }),
  saveTryItPageState: mockSaveTryItPageState,
}));

describe('usePackRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockHandlePackRequest.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not schedule an automatic timeout when submitting a pack request', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const { usePackRequest } = await import('../../../website/client/composables/usePackRequest.js');

    const request = usePackRequest();
    request.inputUrl.value = 'yamadashy/repomix';

    await request.submitRequest();

    expect(mockHandlePackRequest).toHaveBeenCalledOnce();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});
