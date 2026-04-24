import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('calls callback when location is selected', async () => {
    const user = userEvent.setup();
    const handleCityChange = vi.fn();

    renderWithProviders(
      <LocationsList currentCity="Paris" onCityChange={handleCityChange} />,
    );

    await user.click(screen.getByText('Amsterdam'));

    expect(handleCityChange).toHaveBeenCalledWith('Amsterdam');
  });
});
