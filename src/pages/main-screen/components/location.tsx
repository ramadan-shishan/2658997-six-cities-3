import React, { memo, useCallback } from 'react';
import type { City } from '../../../store/offers-slice.ts';

type LocationProps = {
  city: City;
  isActive: boolean;
  onCityChange: (city: City) => void;
};

const Location = ({
  city,
  isActive,
  onCityChange,
}: LocationProps): React.ReactElement => {
  const handleClick = useCallback(() => {
    onCityChange(city);
  }, [city, onCityChange]);

  return (
    <li className="locations__item">
      <a
        className={`locations__item-link tabs__item ${isActive ? 'tabs__item--active' : ''}`}
        onClick={handleClick}
        tabIndex={0}
      >
        <span>{city}</span>
      </a>
    </li>
  );
};

const MemoizedLocation = memo(Location);

export default MemoizedLocation;
