import { swrPostFetcher } from '@atb/modules/api-browser';
import { useRouter } from 'next/router';
import { useState } from 'react';

/**
 * Stores a trip from the trip search and opens its details page, which is
 * addressed by the ID of the stored trip.
 */
export function useOpenTrip() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function openTrip(compressedQuery: string) {
    setIsLoading(true);
    try {
      const { tripId } = await swrPostFetcher([
        '/api/trip',
        { compressedQuery },
      ]);
      await router.push(`/trip/${tripId}`);
    } finally {
      setIsLoading(false);
    }
  }

  return { openTrip, isLoading };
}
