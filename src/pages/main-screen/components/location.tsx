import React from 'react';

type LocationProps = {
  city: string;
  isActive: boolean;
  onCityChange: (city: string) => void;
};

const Location = ({
  city,
  isActive,
  onCityChange,
}: LocationProps): React.ReactElement => (
  <li className="locations__item">
    <a
      className={`locations__item-link tabs__item ${isActive ? 'tabs__item--active' : ''}`}
      onClick={() => onCityChange(city)}
      tabIndex={0}
    >
      <span>{city}</span>
    </a>
  </li>
);

export default Location;
