import { type Requester, genericError } from '@atb/modules/api-client';
import { autocompleteRootSchema } from './encoders';

export type AutocompleteFeature = {
  name: string;
};

export type AutocompleteApi = {
  autocomplete(query: string): Promise<AutocompleteFeature[]>;
};

export function createAutocompleteApi(
  request: Requester<'entur'>,
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
      }));
    },
  };

  return client;
}
