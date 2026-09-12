import { apiFetch, ApiError } from './client';

function mockFetchOnce(status, body) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('apiFetch', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns parsed JSON on success', async () => {
    mockFetchOnce(200, { message: 'ok' });

    const result = await apiFetch('/health');

    expect(result).toEqual({ message: 'ok' });
  });

  it('attaches an Authorization header when a token is given', async () => {
    mockFetchOnce(200, {});

    await apiFetch('/users/me', { token: 'jwt-token' });

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe('Bearer jwt-token');
  });

  it('throws an ApiError with the server message on a non-2xx response', async () => {
    mockFetchOnce(401, { error: 'Invalid email or password' });

    await expect(apiFetch('/auth/login', { method: 'POST', body: {} })).rejects.toThrow(
      'Invalid email or password',
    );
  });

  it('sets the ApiError status from the response', async () => {
    mockFetchOnce(404, { error: 'Not found' });

    try {
      await apiFetch('/doctors/missing');
      throw new Error('expected apiFetch to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(404);
    }
  });

  it('falls back to a generic message when the error body has no JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json');
      },
    });

    await expect(apiFetch('/broken')).rejects.toThrow('Something went wrong');
  });
});
