import { serviceJourneyFixture } from './service-journey-data.fixture';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DeparturesDetails } from '../details';
import { GlobalMessageContextProvider } from '@atb/modules/global-messages';

vi.mock('next/router', () => require('next-router-mock'));

afterEach(function () {
  cleanup();
});

const fromStopPosition = 7;

const customRender = (ui: React.ReactNode) => {
  return render(
    <GlobalMessageContextProvider>{ui}</GlobalMessageContextProvider>,
  );
};

describe('departure details page', function () {
  it('should render correct header', () => {
    const output = customRender(
      <DeparturesDetails
        fromStopPosition={fromStopPosition}
        serviceJourney={serviceJourneyFixture}
      />,
    );
    expect(output.getByText(`Vestlia via sentrum`)).toBeInTheDocument();
  });

  it('should not render passed quays', () => {
    const output = customRender(
      <DeparturesDetails
        fromStopPosition={fromStopPosition}
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
      serviceJourneyFixture.estimatedCalls.find(
        (call) => call.stopPositionInPattern === fromStopPosition,
      )?.quay.name || '';
    expect(output.queryByText(fromQuayName)).toBeInTheDocument();
  });

  it('should render passed departures when collapse button is clicked', async () => {
    const output = customRender(
      <DeparturesDetails
        fromStopPosition={fromStopPosition}
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
      (call) => call.stopPositionInPattern === fromStopPosition,
    );
    const expectedDepartures = serviceJourneyFixture.estimatedCalls.slice(
      fromQuayIndex,
      serviceJourneyFixture.estimatedCalls.length,
    );
    const output = customRender(
      <DeparturesDetails
        fromStopPosition={fromStopPosition}
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
