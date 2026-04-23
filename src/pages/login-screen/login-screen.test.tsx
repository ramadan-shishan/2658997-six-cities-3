import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginScreen from './login-screen.tsx';
import { AuthorizationStatus, CITIES } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('LoginScreen', () => {
  it('shows validation error for password without a digit', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginScreen />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          authToken: null,
          email: null,
          loading: false,
        },
      },
    });

    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Password must contain at least one letter and one digit.',
    );
  });

  it('changes city after random city link click', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginScreen />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          authToken: null,
          email: null,
          loading: false,
        },
      },
    });

    const cityLink = screen
      .getAllByRole('link')
      .find((link) => CITIES.includes(link.textContent ?? ''));

    expect(cityLink).toBeDefined();

    await user.click(cityLink as HTMLElement);

    expect(store.getState().offers.city).toBe(cityLink?.textContent);
  });

  it('redirects authorized user to main screen', () => {
    renderWithProviders(<LoginScreen />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });
});
