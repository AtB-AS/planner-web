import { describe, expect, test } from 'vitest';
import { orgSpecificTranslations } from '../utils';
import { translation as _ } from '../commons';

describe('orgSpecificTranslations', () => {
  test('should override specific fields when specifying one org', () => {
    const TitlesInternal = {
      title: _('A', 'A', 'A'),
    };

    const Titles = orgSpecificTranslations(
      TitlesInternal,
      {
        nfk: {
          title: _('B', 'B', 'B'),
        },
      },
      'nfk',
    );

    expect(Titles.title.no).toEqual('B');
  });

  test('should override specific fields for multiple orgs', () => {
    const TitlesInternal = {
      title: _('A', 'A', 'A'),
    };

    const overrides = {
      nfk: {
        title: _('B', 'B', 'B'),
      },
      fram: {
        title: _('C', 'C', 'C'),
      },
    };

    const TitlesNfk = orgSpecificTranslations(TitlesInternal, overrides, 'nfk');
    const TitlesFram = orgSpecificTranslations(
      TitlesInternal,
      overrides,
      'fram',
    );

    expect(TitlesNfk.title.no).toEqual('B');
    expect(TitlesFram.title.no).toEqual('C');
  });
});
