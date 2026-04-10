import {useEffect, useRef, useState, type RefObject} from 'react';
import {Map as LeafletMap, tileLayer} from 'leaflet';
import {type City} from '../types/offer.ts';

const useMap = (mapRef: RefObject<HTMLElement>, city: City): LeafletMap | null => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current === null || mapInstanceRef.current !== null) {
      return;
    }

    const instance = new LeafletMap(mapRef.current, {
      center: [city.location.latitude, city.location.longitude],
      zoom: city.location.zoom
    });

    tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(instance);

    mapInstanceRef.current = instance;
    setMap(instance);

    return () => {
      instance.remove();
      mapInstanceRef.current = null;
      setMap(null);
    };
  }, [city.location.latitude, city.location.longitude, city.location.zoom, mapRef]);

  useEffect(() => {
    if (map === null) {
      return;
    }

    map.setView(
      [city.location.latitude, city.location.longitude],
      city.location.zoom
    );
  }, [city.location.latitude, city.location.longitude, city.location.zoom, map]);

  return map;
};

export default useMap;
