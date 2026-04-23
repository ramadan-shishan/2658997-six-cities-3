import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import FavoriteButton from './favorite-button.tsx';
import { api, APIRoute } from '../../store/api.ts';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeOfferDetails, makeFakeOfferPreview } from '../../utils/mock-data.ts';

const renderButton = (isFavorite = false) => (
  <FavoriteButton
    offerId="1"
    isFavorite={isFavorite}
    buttonClassName="bookmark-button"
    activeButtonClassName="bookmark-button--active"
    iconClassName="bookmark-icon"
    iconWidth={18}
    iconHeight={19}
  />
);

describe('FavoriteButton', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('redirects unauthorized user to login page on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/" element={renderButton()} />
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>,
      {
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

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('toggles favorite status for authorized user', async () => {
    const user = userEvent.setup();
    const offer = makeFakeOfferPreview('1');
    const details = { ...makeFakeOfferDetails('1'), isFavorite: true };

    mockApi.onPost(`${APIRoute.Favorites}/1/1`).reply(200, details);
    mockApi.onGet(APIRoute.Favorites).reply(200, [offer]);

    const { store } = renderWithProviders(
      <FavoriteButton
        offerId="1"
        isFavorite={false}
        buttonClassName="bookmark-button"
        activeButtonClassName="bookmark-button--active"
        iconClassName="bookmark-icon"
        iconWidth={18}
        iconHeight={19}
      />,
      {
        preloadedState: {
          user: {
            authorizationStatus: AuthorizationStatus.Auth,
            authToken: 'token',
            email: 'test@test.com',
            loading: false,
          },
          offers: {
            city: 'Paris',
            offers: [offer],
            sortType: 'Popular',
            loading: false,
            error: null,
            currentOfferDetails: null,
            currentOfferDetailsLoading: false,
            currentOfferDetailsErrorStatus: null,
            nearbyOffers: [],
            nearbyOffersLoading: false,
            nearbyOffersError: null,
          },
        },
      },
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(store.getState().offers.offers[0].isFavorite).toBe(true);
    });
  });
});
