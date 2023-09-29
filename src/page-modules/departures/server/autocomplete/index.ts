import { genericError, type HttpRequester } from '@atb/modules/api-server';
import type { AutocompleteFeature } from '../../types';
import { autocompleteRootSchema } from './encoders';

export type AutocompleteApi = {
  autocomplete(query: string): Promise<AutocompleteFeature[]>;
};

export function createAutocompleteApi(
  request: HttpRequester<'http-entur'>,
): AutocompleteApi {
  const client: AutocompleteApi = {
    async autocomplete(query) {
      const result = await request(
        `/geocoder/v1/autocomplete?text=${query}&size=20&lang=no`,
      );

      const parsed = autocompleteRootSchema.safeParse(await result.json());

      if (!parsed.success) {
        throw genericError();
      }

      return parsed.data.features.map((f) => ({
        name: f.properties.name,
        locality: f.properties.locality,
        category: f.properties.category,
        layer: f.properties.layer,
        geometry: {
          coordinates: f.geometry.coordinates,
        },
      }));
    },
  };

  return client;
}
