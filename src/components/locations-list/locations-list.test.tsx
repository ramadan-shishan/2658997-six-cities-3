import { screen } from '@testing-library/react';
import LocationsList from './locations-list.tsx';
import { CITIES } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('LocationsList', () => {
  it('renders all cities and marks current one as active', () => {
    const { container } = renderWithProviders(
      <LocationsList currentCity="Paris" onCityChange={vi.fn()} />,
    );

    CITIES.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });

    expect(
      container.querySelector('.tabs__item--active'),
    ).toHaveTextContent('Paris');
  });
});
