import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import Header from './header.tsx';
import { AuthorizationStatus } from '../../const.ts';
import { api, APIRoute } from '../../store/api.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('Header', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

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

  it('logs user out after sign out click', async () => {
    const user = userEvent.setup();
    mockApi.onPost(APIRoute.Logout).reply(204);
    const { store } = renderWithProviders(<Header />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    await user.click(screen.getByText('Sign out'));

    expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
  });
});
