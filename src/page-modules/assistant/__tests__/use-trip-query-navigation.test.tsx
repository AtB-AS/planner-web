import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTripQueryNavigation } from '../use-trip-query-navigation';
import { FromToTripQuery } from '../types';
import { fromFeature, toFeature } from './assistant-data.fixture';

const { push, replace } = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock('next/router', () => ({
  useRouter: () => ({ push, replace }),
}));

const emptyTripQuery: FromToTripQuery = {
  from: null,
  to: null,
  via: null,
  transportModeFilter: [],
  searchTime: { mode: 'now' },
  cursor: null,
  lineFilter: [],
  walkSpeed: null,
  transferSlack: null,
};

// Returns a navigation that stays pending until resolved or rejected.
function pendingNavigation() {
  let resolve!: (value: boolean) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<boolean>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  push.mockReturnValueOnce(promise);
  return { resolve, reject };
}

afterEach(() => {
  vi.resetAllMocks();
});

describe('useTripQueryNavigation', () => {
  it('should keep changes from a pending navigation', async () => {
    pendingNavigation();
    pendingNavigation();
    const { result } = renderHook(() => useTripQueryNavigation(emptyTripQuery));

    act(() => {
      result.current.navigate({ from: fromFeature });
    });
    act(() => {
      result.current.navigate({ to: toFeature });
    });

    expect(push).toHaveBeenLastCalledWith({
      query: expect.objectContaining({
        fromId: fromFeature.id,
        toId: toFeature.id,
      }),
    });
    expect(result.current.getLatestTripQuery()).toMatchObject({
      from: fromFeature,
      to: toFeature,
    });
  });

  it('should not reset loading when an older navigation completes', async () => {
    const first = pendingNavigation();
    const second = pendingNavigation();
    const { result } = renderHook(() =>
      useTripQueryNavigation({ ...emptyTripQuery, from: fromFeature }),
    );

    act(() => {
      result.current.navigate({ to: toFeature });
    });
    act(() => {
      result.current.navigate({ walkSpeed: 2 });
    });
    expect(result.current.isPerformingSearchNavigation).toBe(true);

    // The first navigation is cancelled by the second one.
    await act(async () => first.resolve(false));
    expect(result.current.isPerformingSearchNavigation).toBe(true);

    await act(async () => second.resolve(true));
    expect(result.current.isPerformingSearchNavigation).toBe(false);
  });

  it('should reset loading when the navigation fails', async () => {
    const navigation = pendingNavigation();
    const { result } = renderHook(() =>
      useTripQueryNavigation({ ...emptyTripQuery, from: fromFeature }),
    );

    let navigatePromise!: Promise<void>;
    act(() => {
      navigatePromise = result.current.navigate({ to: toFeature });
    });
    expect(result.current.isPerformingSearchNavigation).toBe(true);

    await act(async () => {
      navigation.reject(new Error('Navigation failed'));
      await navigatePromise.catch(() => {});
    });
    expect(result.current.isPerformingSearchNavigation).toBe(false);
  });

  it('should sync with the trip query when not navigating, e.g. back/forward', () => {
    const { result, rerender } = renderHook(
      ({ tripQuery }) => useTripQueryNavigation(tripQuery),
      { initialProps: { tripQuery: emptyTripQuery } },
    );

    const previousTripQuery: FromToTripQuery = {
      ...emptyTripQuery,
      from: fromFeature,
    };
    rerender({ tripQuery: previousTripQuery });

    expect(result.current.getLatestTripQuery()).toBe(previousTripQuery);
  });

  it('should not overwrite pending changes when the trip query changes during a navigation', () => {
    pendingNavigation();
    const { result, rerender } = renderHook(
      ({ tripQuery }) => useTripQueryNavigation(tripQuery),
      { initialProps: { tripQuery: emptyTripQuery } },
    );

    act(() => {
      result.current.navigate({ from: fromFeature });
    });
    rerender({ tripQuery: { ...emptyTripQuery, to: toFeature } });

    expect(result.current.getLatestTripQuery()).toMatchObject({
      from: fromFeature,
    });
  });

  it('should use replace when requested', () => {
    replace.mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useTripQueryNavigation(emptyTripQuery));

    act(() => {
      result.current.navigate({ walkSpeed: 2 }, true);
    });

    expect(replace).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });
});
