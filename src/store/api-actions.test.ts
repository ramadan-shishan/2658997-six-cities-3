import MockAdapter from 'axios-mock-adapter';
import { api, APIRoute } from './api.ts';
import {
  addComment,
  fetchComments,
  fetchFavorites,
  fetchNearbyOffers,
  fetchOfferDetails,
  fetchOffers,
  toggleFavoriteStatus,
} from './api-actions.ts';
import { makeFakeOfferDetails, makeFakeOfferPreview, makeFakeReview } from '../utils/mock-data.ts';
import { makeTestStore } from '../utils/test-utils.tsx';

describe('Async actions', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('fetchOffers loads offers into store', async () => {
    const store = makeTestStore();
    const offers = [makeFakeOfferPreview('1'), makeFakeOfferPreview('2')];
    mockApi.onGet(APIRoute.Offers).reply(200, offers);

    await store.dispatch(fetchOffers());

    expect(store.getState().offers.offers).toEqual(offers);
  });

  it('fetchOfferDetails stores offer details', async () => {
    const store = makeTestStore();
    const offerDetails = makeFakeOfferDetails('1');
    mockApi.onGet(`${APIRoute.Offers}/1`).reply(200, offerDetails);

    await store.dispatch(fetchOfferDetails('1'));

    expect(store.getState().offers.currentOfferDetails).toEqual(offerDetails);
  });

  it('fetchOfferDetails stores 404 status on not found', async () => {
    const store = makeTestStore();
    mockApi.onGet(`${APIRoute.Offers}/404`).reply(404);

    await store.dispatch(fetchOfferDetails('404'));

    expect(store.getState().offers.currentOfferDetailsErrorStatus).toBe(404);
  });

  it('fetchNearbyOffers loads only first three offers', async () => {
    const store = makeTestStore();
    const nearbyOffers = [
      makeFakeOfferPreview('1'),
      makeFakeOfferPreview('2'),
      makeFakeOfferPreview('3'),
      makeFakeOfferPreview('4'),
    ];
    mockApi.onGet(`${APIRoute.Offers}/1/nearby`).reply(200, nearbyOffers);

    await store.dispatch(fetchNearbyOffers('1'));

    expect(store.getState().offers.nearbyOffers).toEqual(nearbyOffers.slice(0, 3));
  });

  it('fetchFavorites loads favorites into store', async () => {
    const store = makeTestStore();
    const favorites = [makeFakeOfferPreview('1')];
    mockApi.onGet(APIRoute.Favorites).reply(200, favorites);

    await store.dispatch(fetchFavorites());

    expect(store.getState().favorites.favorites).toEqual(favorites);
  });

  it('toggleFavoriteStatus updates local offer state even if favorites refresh fails', async () => {
    const offerPreview = makeFakeOfferPreview('1');
    const offerDetails = { ...makeFakeOfferDetails('1'), isFavorite: true };
    const baseState = makeTestStore().getState();
    const store = makeTestStore({
      ...baseState,
      offers: {
        ...baseState.offers,
        offers: [offerPreview],
        currentOfferDetails: makeFakeOfferDetails('1'),
        nearbyOffers: [offerPreview],
      },
      favorites: {
        ...baseState.favorites,
        favorites: [offerPreview],
      },
    });

    mockApi.onPost(`${APIRoute.Favorites}/1/1`).reply(200, offerDetails);
    mockApi.onGet(APIRoute.Favorites).reply(500);

    await store.dispatch(toggleFavoriteStatus({ offerId: '1', status: 1 }));

    expect(store.getState().offers.offers[0].isFavorite).toBe(true);
    expect(store.getState().offers.currentOfferDetails?.isFavorite).toBe(true);
    expect(store.getState().offers.nearbyOffers[0].isFavorite).toBe(true);
    expect(store.getState().favorites.error).toBe('Failed to load favorites');
  });

  it('fetchComments loads comments into store', async () => {
    const store = makeTestStore();
    const comments = [makeFakeReview('1'), makeFakeReview('2')];
    mockApi.onGet(`${APIRoute.Comments}/1`).reply(200, comments);

    await store.dispatch(fetchComments('1'));

    expect(store.getState().comments.comments).toEqual(comments);
  });

  it('addComment posts comment and reloads comments', async () => {
    const store = makeTestStore();
    const comments = [makeFakeReview('1'), makeFakeReview('2')];

    mockApi.onPost(`${APIRoute.Comments}/1`).reply(200, makeFakeReview('3'));
    mockApi.onGet(`${APIRoute.Comments}/1`).reply(200, comments);

    await store.dispatch(addComment({ offerId: '1', comment: 'New comment', rating: 5 }));

    expect(store.getState().comments.comments).toEqual(comments);
    expect(store.getState().comments.error).toBeNull();
  });
});
