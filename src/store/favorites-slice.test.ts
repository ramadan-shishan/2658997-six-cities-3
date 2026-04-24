import {
  checkAuth,
  fetchFavorites,
  login,
  logout,
  toggleFavoriteStatus,
} from './api-actions.ts';
import { favoritesReducer } from './favorites-slice.ts';
import { makeFakeOfferDetails, makeFakeOfferPreview } from '../utils/mock-data.ts';

describe('favoritesReducer', () => {
  const favoriteOffer = makeFakeOfferPreview();

  it('returns initial state with unknown action', () => {
    expect(favoritesReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      favorites: [],
      loading: false,
      error: null,
      updatingOfferIds: [],
    });
  });

  it('handles fetchFavorites.fulfilled', () => {
    const state = favoritesReducer(
      undefined,
      fetchFavorites.fulfilled([favoriteOffer], '', undefined),
    );

    expect(state.favorites).toEqual([favoriteOffer]);
    expect(state.loading).toBe(false);
  });

  it('handles toggleFavoriteStatus.pending and fulfilled', () => {
    const pendingState = favoritesReducer(
      undefined,
      toggleFavoriteStatus.pending('', { offerId: '1', status: 1 }),
    );
    const fulfilledState = favoritesReducer(
      pendingState,
      toggleFavoriteStatus.fulfilled(
        makeFakeOfferDetails('1'),
        '',
        { offerId: '1', status: 1 },
      ),
    );

    expect(pendingState.updatingOfferIds).toEqual(['1']);
    expect(fulfilledState.updatingOfferIds).toEqual([]);
  });

  it('removes offer from favorites after favorite status is disabled', () => {
    const startState = {
      favorites: [favoriteOffer],
      loading: false,
      error: null,
      updatingOfferIds: ['1'],
    };

    const state = favoritesReducer(
      startState,
      toggleFavoriteStatus.fulfilled(
        { ...makeFakeOfferDetails('1'), isFavorite: false },
        '',
        { offerId: '1', status: 0 },
      ),
    );

    expect(state.favorites).toEqual([]);
    expect(state.updatingOfferIds).toEqual([]);
  });

  it('clears favorites after auth failure actions', () => {
    const startState = {
      favorites: [favoriteOffer],
      loading: false,
      error: null,
      updatingOfferIds: ['1'],
    };

    expect(
      favoritesReducer(startState, checkAuth.rejected(null, '', undefined)),
    ).toEqual({
      favorites: [],
      loading: false,
      error: null,
      updatingOfferIds: [],
    });

    expect(
      favoritesReducer(
        startState,
        login.rejected(null, '', { email: 'test@test.com', password: '123qwe' }),
      ),
    ).toEqual({
      favorites: [],
      loading: false,
      error: null,
      updatingOfferIds: [],
    });
  });

  it('clears favorites after logout.fulfilled', () => {
    const startState = {
      favorites: [favoriteOffer],
      loading: false,
      error: null,
      updatingOfferIds: ['1'],
    };

    const state = favoritesReducer(
      startState,
      logout.fulfilled(undefined, '', undefined),
    );

    expect(state.favorites).toEqual([]);
    expect(state.updatingOfferIds).toEqual([]);
  });
});
