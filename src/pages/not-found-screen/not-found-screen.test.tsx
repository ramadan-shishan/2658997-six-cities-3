import { screen } from '@testing-library/react';
import NotFoundScreen from './not-found-screen.tsx';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('NotFoundScreen', () => {
  it('renders 404 page content', () => {
    renderWithProviders(<NotFoundScreen />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Страница не найдена/i)).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Вернуться на главную/i })).toHaveAttribute('href', '/');
  });

  it('renders authorized user controls in page header', () => {
    renderWithProviders(<NotFoundScreen />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });
});
