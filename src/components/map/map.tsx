import {useEffect, useRef} from 'react';
import {Icon, layerGroup, Map as LeafletMap, Marker, tileLayer} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {type City, type OfferPreview} from '../../types/offer.ts';

type MapProps = {
  city: City;
  offers: OfferPreview[];
  selectedOffer?: OfferPreview | null;
  className?: string;
};

const defaultCustomIcon = new Icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39]
});

const activeCustomIcon = new Icon({
  iconUrl: '/img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39]
});

const Map = ({
  city,
  offers,
  selectedOffer = null,
  className = 'cities__map map'
}: MapProps): JSX.Element => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const initialLocationRef = useRef(city.location);

  useEffect(() => {
    if (mapRef.current === null || mapInstanceRef.current !== null) {
      return;
    }

    const {latitude, longitude, zoom} = initialLocationRef.current;
    const map = new LeafletMap(mapRef.current, {
      center: [latitude, longitude],
      zoom
    });

    tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    mapInstanceRef.current?.setView(
      [city.location.latitude, city.location.longitude],
      city.location.zoom
    );
  }, [city]);

  useEffect(() => {
    if (mapInstanceRef.current === null) {
      return;
    }

    const markersLayer = layerGroup().addTo(mapInstanceRef.current);

    offers.forEach((offer) => {
      const marker = new Marker({
        lat: offer.location.latitude,
        lng: offer.location.longitude
      });

      marker.setIcon(
        selectedOffer !== null && offer.id === selectedOffer.id
          ? activeCustomIcon
          : defaultCustomIcon
      );

      marker.addTo(markersLayer);
    });

    return () => {
      markersLayer.clearLayers();
    };
  }, [offers, selectedOffer]);

  return <div className={className} ref={mapRef} />;
};

export default Map;
