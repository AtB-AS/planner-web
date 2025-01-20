import { serviceJourneyFixture } from './service-journey-data.fixture';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DeparturesDetails } from '../details';
import { formatDestinationDisplay } from '../utils';
import { GlobalMessageContextProvider } from '@atb/modules/global-messages';

afterEach(function () {
  cleanup();
});

const serviceJourneyId = 'ATB:ServiceJourney:22_230306097862461_113';
const date = '2023-11-10';
const fromQuayId = 'NSR:Quay:74990';

const customRender = (ui: React.ReactNode) => {
  return render(
    <GlobalMessageContextProvider>{ui}</GlobalMessageContextProvider>,
  );
};

describe('departure details page', function () {
  it('should render correct header', () => {
    const output = customRender(
      <DeparturesDetails
        fromQuayId={fromQuayId}
        serviceJourney={serviceJourneyFixture}
      />,
    );
    expect(
      output.getByText(
        `${serviceJourneyFixture.line.publicCode} Vestlia via sentrum`,
      ),
    ).toBeInTheDocument();
  });

  it('should not render passed quays', () => {
    const output = customRender(
      <DeparturesDetails
        fromQuayId={fromQuayId}
        serviceJourney={serviceJourneyFixture}
      />,
    );

    expect(
      output.queryByText(
        `${serviceJourneyFixture.estimatedCalls[0].quay.name}`,
      ),
    ).toBeInTheDocument();

    expect(
      output.queryByText(
        `${serviceJourneyFixture.estimatedCalls[2].quay.name}`,
      ),
    ).not.toBeInTheDocument();

    const fromQuayName =
      serviceJourneyFixture.estimatedCalls
        .map((call) => call.quay)
        .find((quay) => quay.id === fromQuayId)?.name || '';
    expect(output.queryByText(fromQuayName)).toBeInTheDocument();
  });

  it('should render passed departures when collapse button is clicked', async () => {
    const output = customRender(
      <DeparturesDetails
        fromQuayId={fromQuayId}
        serviceJourney={serviceJourneyFixture}
      />,
    );
    const button = screen.getByRole('button', {
      name: /mellomstopp/i,
    });

    await userEvent.click(button);

    expect(
      output.queryByText(
        `${serviceJourneyFixture.estimatedCalls[2].quay.name}`,
      ),
    ).toBeInTheDocument();

    await userEvent.click(button);

    expect(
      output.queryByText(
        `${serviceJourneyFixture.estimatedCalls[2].quay.name}`,
      ),
    ).not.toBeInTheDocument();
  });

  it('should render all departures', async () => {
    const fromQuayIndex = serviceJourneyFixture.estimatedCalls.findIndex(
      (call) => call.quay.id === fromQuayId,
    );
    const expectedDepartures = serviceJourneyFixture.estimatedCalls.slice(
      fromQuayIndex,
      serviceJourneyFixture.estimatedCalls.length,
    );
    const output = customRender(
      <DeparturesDetails
        fromQuayId={fromQuayId}
        serviceJourney={serviceJourneyFixture}
      />,
    );

    for (let i = 0; i < expectedDepartures.length; i++) {
      expect(
        output.getByText(`${expectedDepartures[i].quay.name}`),
      ).toBeInTheDocument();
    }
  });
});
