import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import mockRouter from 'next-router-mock';

import DeparturesPage, {
  DeparturesPageProps,
} from '@atb/pages/departures/[[...id]]';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser(['/departures/[id]']));

describe('departure page', function () {
  it('should show id provided in route', async () => {
    await mockRouter.push('/departures/NSR:StopPlace:123');

    const initialProps: DeparturesPageProps = {
      headersAcceptLanguage: 'en',
      initialCookies: {
        darkmode: false,
        language: 'en',
      },
    };

    const output = render(<DeparturesPage {...initialProps} />);
    expect(output.getByText('NSR:StopPlace:123')).toBeInTheDocument();
  });
});
