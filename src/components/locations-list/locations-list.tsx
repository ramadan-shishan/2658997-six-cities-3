import React from 'react';
import {CITIES} from '../../const.ts';
import Location from '../../pages/main-screen/components/location.tsx';

type LocationsListProps = {
  currentCity: string;
  onCityChange: (city: string) => void;
};

const LocationsList = ({currentCity, onCityChange}: LocationsListProps): React.ReactElement => (
  <ul className="locations__list tabs__list">
    {CITIES.map((city) => (
      <Location
        key={city}
        city={city}
        isActive={city === currentCity}
        onCityChange={onCityChange}
      />
    ))}
  </ul>
);

export default LocationsList;
