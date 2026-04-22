import { screen } from '@testing-library/react';
import NotFoundScreen from './not-found-screen.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('NotFoundScreen', () => {
  it('renders 404 page content', () => {
    renderWithProviders(<NotFoundScreen />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Страница не найдена/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Вернуться на главную/i })).toHaveAttribute('href', '/');
  });
});
