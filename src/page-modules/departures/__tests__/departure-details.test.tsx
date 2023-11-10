import { serviceJourneyFixture } from './service-journey-data.fixture';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DeparturesDetails } from '../details';

afterEach(function () {
  cleanup();
});

const serviceJourneyId = 'ATB:ServiceJourney:22_230306097862461_113';
const date = '2023-11-10';
const fromQuayId = 'NSR:Quay:74990';

describe('departure details page', function () {
  it('should render correct header', () => {
    const output = render(
      <DeparturesDetails
        fromQuayId={fromQuayId}
        serviceJourney={serviceJourneyFixture}
      />,
    );
    expect(
      output.getByText(
        `${serviceJourneyFixture.line.publicCode} ${serviceJourneyFixture.estimatedCalls[0].destinationDisplay.frontText}`,
      ),
    ).toBeInTheDocument();
  });
});
