import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route.tsx';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('PrivateRoute', () => {
  it('renders spinner while auth status is loading', () => {
    renderWithProviders(
      <PrivateRoute>
        <div>Private content</div>
      </PrivateRoute>,
      {
        preloadedState: {
          user: {
            authorizationStatus: AuthorizationStatus.NoAuth,
            authToken: null,
            email: null,
            loading: true,
          },
        },
      },
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children for authorized user', () => {
    renderWithProviders(
      <PrivateRoute>
        <div>Private content</div>
      </PrivateRoute>,
      {
        preloadedState: {
          user: {
            authorizationStatus: AuthorizationStatus.Auth,
            authToken: 'token',
            email: 'test@test.com',
            loading: false,
          },
        },
      },
    );

    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  it('redirects unauthorized user to login page', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/private"
          element={(
            <PrivateRoute>
              <div>Private content</div>
            </PrivateRoute>
          )}
        />
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>,
      {
        route: '/private',
        preloadedState: {
          user: {
            authorizationStatus: AuthorizationStatus.NoAuth,
            authToken: null,
            email: null,
            loading: false,
          },
        },
      },
    );

    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });
});
