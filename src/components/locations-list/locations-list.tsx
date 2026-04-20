import React, { memo } from 'react';
import {CITIES} from '../../const.ts';
import Location from '../../pages/main-screen/components/location.tsx';
import type { City } from '../../store/offers-slice.ts';

type LocationsListProps = {
  currentCity: City;
  onCityChange: (city: City) => void;
};

const LocationsList = ({
  currentCity,
  onCityChange,
}: LocationsListProps): React.ReactElement => (
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

const MemoizedLocationsList = memo(LocationsList);

export default MemoizedLocationsList;
