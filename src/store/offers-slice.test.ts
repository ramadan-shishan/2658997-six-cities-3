import {
  fetchNearbyOffers,
  fetchOfferDetails,
  fetchOffers,
  toggleFavoriteStatus,
} from './api-actions.ts';
import { changeCity, offersReducer, setSortType } from './offers-slice.ts';
import { makeFakeOfferDetails, makeFakeOfferPreview } from '../utils/mock-data.ts';

describe('offersReducer', () => {
  const offerPreview = makeFakeOfferPreview();
  const offerDetails = makeFakeOfferDetails();

  it('returns initial state with unknown action', () => {
    expect(offersReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      city: 'Paris',
      offers: [],
      sortType: 'Popular',
      loading: false,
      error: null,
      currentOfferDetails: null,
      currentOfferDetailsLoading: false,
      currentOfferDetailsErrorStatus: null,
      nearbyOffers: [],
      nearbyOffersLoading: false,
      nearbyOffersError: null,
    });
  });

  it('changes city', () => {
    const state = offersReducer(undefined, changeCity('Amsterdam'));

    expect(state.city).toBe('Amsterdam');
  });

  it('changes sort type', () => {
    const state = offersReducer(undefined, setSortType('TopRated'));

    expect(state.sortType).toBe('TopRated');
  });

  it('handles fetchOffers.fulfilled', () => {
    const state = offersReducer(undefined, fetchOffers.fulfilled([offerPreview], '', undefined));

    expect(state.offers).toEqual([offerPreview]);
    expect(state.loading).toBe(false);
  });

  it('handles fetchOfferDetails.rejected', () => {
    const state = offersReducer(
      undefined,
      fetchOfferDetails.rejected(null, '', '1', 404),
    );

    expect(state.currentOfferDetails).toBeNull();
    expect(state.currentOfferDetailsLoading).toBe(false);
    expect(state.currentOfferDetailsErrorStatus).toBe(404);
  });

  it('handles fetchNearbyOffers.fulfilled and limits result to three offers', () => {
    const nearbyOffers = [
      makeFakeOfferPreview('1'),
      makeFakeOfferPreview('2'),
      makeFakeOfferPreview('3'),
      makeFakeOfferPreview('4'),
    ];

    const state = offersReducer(
      undefined,
      fetchNearbyOffers.fulfilled(nearbyOffers, '', '1'),
    );

    expect(state.nearbyOffers).toHaveLength(3);
    expect(state.nearbyOffersLoading).toBe(false);
  });

  it('updates favorite flag in offers, nearby offers and current offer details', () => {
    const startState = {
      city: 'Paris' as const,
      offers: [offerPreview],
      sortType: 'Popular' as const,
      loading: false,
      error: null,
      currentOfferDetails: offerDetails,
      currentOfferDetailsLoading: false,
      currentOfferDetailsErrorStatus: null,
      nearbyOffers: [offerPreview],
      nearbyOffersLoading: false,
      nearbyOffersError: null,
    };

    const state = offersReducer(
      startState,
      toggleFavoriteStatus.fulfilled(
        { ...offerDetails, isFavorite: true },
        '',
        { offerId: offerDetails.id, status: 1 },
      ),
    );

    expect(state.offers[0].isFavorite).toBe(true);
    expect(state.nearbyOffers[0].isFavorite).toBe(true);
    expect(state.currentOfferDetails?.isFavorite).toBe(true);
  });
});
