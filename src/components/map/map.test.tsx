import { render } from '@testing-library/react';
import { Marker, layerGroup } from 'leaflet';
import Map from './map.tsx';
import { makeFakeOfferPreview } from '../../utils/mock-data.ts';

const mocks = vi.hoisted(() => ({
  addToLayer: vi.fn(),
  markerAddTo: vi.fn(),
  removeLayer: vi.fn(),
  setIcon: vi.fn(),
  map: {},
}));

vi.mock('../../hooks/use-map.ts', () => ({
  default: vi.fn(() => mocks.map),
}));

vi.mock('leaflet', () => ({
  Icon: vi.fn((options: unknown) => ({ options })),
  Marker: vi.fn(() => ({
    addTo: mocks.markerAddTo,
    setIcon: mocks.setIcon,
  })),
  layerGroup: vi.fn(() => ({
    addTo: mocks.addToLayer,
    remove: mocks.removeLayer,
  })),
}));

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders markers and highlights selected offer', () => {
    const offers = [makeFakeOfferPreview('1'), makeFakeOfferPreview('2')];

    render(
      <Map
        city={offers[0].city}
        offers={offers}
        selectedOffer={offers[1]}
      />,
    );

    expect(Marker).toHaveBeenCalledTimes(offers.length);
    expect(mocks.setIcon).toHaveBeenCalledTimes(offers.length);
    expect(layerGroup).toHaveBeenCalledTimes(1);
    expect(mocks.addToLayer).toHaveBeenCalledWith(mocks.map);
  });
});
