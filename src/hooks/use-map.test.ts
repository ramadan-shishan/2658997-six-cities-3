import { renderHook, waitFor } from '@testing-library/react';
import { Map as LeafletMap, tileLayer } from 'leaflet';
import useMap from './use-map.ts';
import type { City } from '../types/offer.ts';

const mocks = vi.hoisted(() => ({
  addTo: vi.fn(),
  remove: vi.fn(),
  setView: vi.fn(),
}));

vi.mock('leaflet', () => ({
  Map: vi.fn(() => ({
    remove: mocks.remove,
    setView: mocks.setView,
  })),
  tileLayer: vi.fn(() => ({
    addTo: mocks.addTo,
  })),
}));

const paris: City = {
  name: 'Paris',
  location: {
    latitude: 48.85661,
    longitude: 2.351499,
    zoom: 13,
  },
};

const amsterdam: City = {
  name: 'Amsterdam',
  location: {
    latitude: 52.370216,
    longitude: 4.895168,
    zoom: 12,
  },
};

describe('useMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not create a map without container element', () => {
    const ref = { current: null };

    const { result } = renderHook(() => useMap(ref, paris));

    expect(result.current).toBeNull();
    expect(LeafletMap).not.toHaveBeenCalled();
  });

  it('creates map, updates view when city changes and removes map on unmount', async () => {
    const container = document.createElement('div');
    const ref = { current: container };

    const { result, rerender, unmount } = renderHook(
      ({ city }) => useMap(ref, city),
      { initialProps: { city: paris } },
    );

    await waitFor(() => expect(result.current).not.toBeNull());

    expect(LeafletMap).toHaveBeenCalledWith(container, {
      center: [paris.location.latitude, paris.location.longitude],
      zoom: paris.location.zoom,
    });
    expect(tileLayer).toHaveBeenCalledWith(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' },
    );
    expect(mocks.addTo).toHaveBeenCalledWith(result.current);

    rerender({ city: amsterdam });

    expect(mocks.setView).toHaveBeenLastCalledWith(
      [amsterdam.location.latitude, amsterdam.location.longitude],
      amsterdam.location.zoom,
    );

    unmount();

    expect(mocks.remove).toHaveBeenCalled();
  });
});
