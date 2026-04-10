import {useEffect, useRef} from 'react';
import {Icon, layerGroup, Marker} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {type City, type Offer} from '../../types/offer.ts';
import useMap from '../../hooks/use-map.ts';

type MapProps = {
  city: City;
  offers: Offer[];
  selectedOffer?: Offer | null;
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
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map === null) {
      return;
    }

    const markersLayer = layerGroup().addTo(map);

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
      markersLayer.remove();
    };
  }, [map, offers, selectedOffer]);

  return <div className={className} ref={mapRef} />;
};

export default Map;
