import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MapHeader, type MapHeaderProps } from '../map-header';
import { TransportMode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

const stopPlaceMock: MapHeaderProps = {
  layer: 'venue',
  name: 'Trondheim S',
  position: { lat: 63.43049, lon: 10.39506 },
  transportModes: [TransportMode.Bus],
};

const addressMock: MapHeaderProps = {
  layer: 'address',
  name: 'Prinsens gate',
  position: { lat: 63.43049, lon: 10.39506 },
};

afterEach(function () {
  cleanup();
});

describe('MapHeader', function () {
  it('should render travel to and from links for stop place', async () => {
    const output = render(<MapHeader {...stopPlaceMock} />);

    expect(output.getByText('Reis fra')).toBeInTheDocument();
    expect(output.getByText('Reis til')).toBeInTheDocument();
  });

  it('should not render travel to and from links for address', async () => {
    const output = render(<MapHeader {...addressMock} />);

    expect(output.queryByText('Reis fra')).not.toBeInTheDocument();
    expect(output.queryByText('Reis til')).not.toBeInTheDocument();
  });

  it('should show icons for travel method', async () => {
    const output = render(
      <MapHeader
        {...stopPlaceMock}
        transportModes={[TransportMode.Bus, TransportMode.Tram]}
      />,
    );
    expect(output.getByAltText('Buss')).toBeInTheDocument();
    expect(output.getByAltText('Trikk')).toBeInTheDocument();
  });
});
