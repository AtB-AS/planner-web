import { Mock, afterAll, describe, beforeEach, expect, it, vi } from 'vitest';
import { createRequester } from '../requesters/http-requester';

const initialFetch = global.fetch;
let mockFetch: Mock;

beforeEach(() => {
  mockFetch = vi.fn();
  global.fetch = mockFetch;
});
afterAll(() => {
  global.fetch = initialFetch;
});

describe('requester utils', () => {
  it('should pass on X-Correlation-Id from request', async () => {
    const expectedCorrelationId = 'abc';

    const requester = createRequester('http-entur', {
      headers: {
        'X-Correlation-Id': expectedCorrelationId,
      },
    });

    try {
      await requester('/');
    } catch (e) {}

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Correlation-Id': expectedCorrelationId,
        }),
      }),
    );
  });

  it('should create new X-Correlation-Id if not provided', async () => {
    const requester = createRequester('http-entur');

    try {
      await requester('/');
    } catch (e) {}

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Correlation-Id': expect.stringContaining('-'),
        }),
      }),
    );
  });

  it('should create new X-Correlation-Id if headers sent but without existing correlation id', async () => {
    const requester = createRequester('http-entur', {
      headers: { 'Atb-Install-Id': 'foo' },
    });

    try {
      await requester('/');
    } catch (e) {}

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Correlation-Id': expect.stringContaining('-'),
        }),
      }),
    );
  });

  it('should pass on install id and correlation', async () => {
    const expectedCorrelationId = 'abc';
    const expectedInstallId = 'install';

    const requester = createRequester('http-entur', {
      headers: {
        'Atb-Install-Id': expectedInstallId,
        'X-Correlation-Id': expectedCorrelationId,
      },
    });

    try {
      await requester('/');
    } catch (e) {}

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Correlation-Id': expectedCorrelationId,
          'Atb-Install-Id': expectedInstallId,
        }),
      }),
    );
  });

  it('should provide proper ET client name', async () => {
    const expectedCorrelationId = 'abc';
    const expectedInstallId = 'install';

    const requester = createRequester('http-entur', {
      headers: {
        'Atb-Install-Id': expectedInstallId,
        'X-Correlation-Id': expectedCorrelationId,
      },
    });

    try {
      await requester('/');
    } catch (e) {}

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          'ET-Client-Name': 'atb-planner-web',
        }),
      }),
    );
  });

  it('should pass in headers as sent in by request', async () => {
    const expectedCorrelationId = 'abc';
    const expectedInstallId = 'install';

    const requester = createRequester('http-entur', {
      headers: {
        'Atb-Install-Id': expectedInstallId,
        'X-Correlation-Id': expectedCorrelationId,
      },
    });

    try {
      await requester('/', {
        headers: {
          'X-Extra': 'foo',
        },
      });
    } catch (e) {}

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          'ET-Client-Name': 'atb-planner-web',
          'Atb-Install-Id': expectedInstallId,
          'X-Correlation-Id': expectedCorrelationId,
          'X-Extra': 'foo',
        }),
      }),
    );
  });
});
