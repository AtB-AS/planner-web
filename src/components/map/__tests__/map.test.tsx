import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MapHeader } from '@atb/components/map';
import { MapHeaderProps } from '@atb/components/map/map-header';
import { FeatureCategory } from '@atb/components/venue-icon';

const stopPlaceMock: MapHeaderProps = {
  layer: 'venue',
  name: 'Trondheim S',
  id: 'NSR:StopPlace:41742',
  street: 'Fosenkaia',
  category: [FeatureCategory.ONSTREET_BUS],
};

const addressMock: MapHeaderProps = {
  layer: 'address',
  id: '44523952221',
  name: 'Prinsens gate',
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
        category={[FeatureCategory.ONSTREET_BUS, FeatureCategory.ONSTREET_TRAM]}
      />,
    );
    expect(output.getByAltText('Buss')).toBeInTheDocument();
    expect(output.getByAltText('Trikk')).toBeInTheDocument();
  });
});