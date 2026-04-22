import { screen } from '@testing-library/react';
import Header from './header.tsx';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('Header', () => {
  it('renders sign in link for unauthorized user', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          authToken: null,
          email: null,
          loading: false,
        },
      },
    });

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders email and favorites count for authorized user', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
        favorites: {
          favorites: [{ id: '1' }] as never[],
          loading: false,
          error: null,
          updatingOfferIds: [],
        },
      },
    });

    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });
});
