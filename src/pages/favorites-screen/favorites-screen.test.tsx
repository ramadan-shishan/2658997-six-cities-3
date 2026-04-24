import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import FavoritesScreen from './favorites-screen.tsx';
import { api, APIRoute } from '../../store/api.ts';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeOfferPreview } from '../../utils/mock-data.ts';

describe('FavoritesScreen', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('loads favorites, groups them by city and changes city after group link click', async () => {
    const user = userEvent.setup();
    const favoriteOffer = {
      ...makeFakeOfferPreview('1'),
      isFavorite: true,
      city: {
        name: 'Amsterdam',
        location: {
          latitude: 52.370216,
          longitude: 4.895168,
          zoom: 12,
        },
      },
    };

    mockApi.onGet(APIRoute.Favorites).reply(200, [favoriteOffer]);

    const { store } = renderWithProviders(<FavoritesScreen />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    expect(await screen.findByText('Saved listing')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText(favoriteOffer.title)).toBeInTheDocument();

    await user.click(screen.getByText('Amsterdam'));

    expect(store.getState().offers.city).toBe('Amsterdam');
  });

  it('shows empty state when user has no favorites', async () => {
    mockApi.onGet(APIRoute.Favorites).reply(200, []);

    renderWithProviders(<FavoritesScreen />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    expect(await screen.findByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('shows loader while favorites are loading', () => {
    mockApi.onGet(APIRoute.Favorites).reply(200, []);

    renderWithProviders(<FavoritesScreen />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Nothing yet saved.')).not.toBeInTheDocument();
  });
});
