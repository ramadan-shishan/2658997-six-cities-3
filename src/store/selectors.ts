import { createSelector } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../const.ts';
import type { OfferPreview } from '../types/offer.ts';
import type { RootState } from './index.ts';

const sortOffers = (offers: OfferPreview[], sortType: RootState['offers']['sortType']) => {
  switch (sortType) {
    case 'PriceLowToHigh':
      return [...offers].sort((firstOffer, secondOffer) => firstOffer.price - secondOffer.price);
    case 'PriceHighToLow':
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.price - firstOffer.price);
    case 'TopRated':
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.rating - firstOffer.rating);
    default:
      return offers;
  }
};

export const selectOffersState = (state: RootState) => state.offers;
export const selectUserState = (state: RootState) => state.user;
export const selectCommentsState = (state: RootState) => state.comments;

export const selectCity = (state: RootState) => state.offers.city;
export const selectOffers = (state: RootState) => state.offers.offers;
export const selectSortType = (state: RootState) => state.offers.sortType;
export const selectOffersLoading = (state: RootState) => state.offers.loading;
export const selectCurrentOfferDetails = (state: RootState) => state.offers.currentOfferDetails;

export const selectAuthorizationStatus = (state: RootState) => state.user.authorizationStatus;
export const selectUserEmail = (state: RootState) => state.user.email;
export const selectIsAuthorized = createSelector(
  [selectAuthorizationStatus],
  (authorizationStatus) => authorizationStatus === AuthorizationStatus.Auth,
);

export const selectComments = (state: RootState) => state.comments.comments;
export const selectCommentsCount = createSelector(
  [selectComments],
  (comments) => comments.length,
);
export const selectSortedComments = createSelector([selectComments], (comments) =>
  [...comments]
    .sort((firstComment, secondComment) => new Date(secondComment.date).getTime() - new Date(firstComment.date).getTime())
    .slice(0, 10),
);

export const selectCurrentCityOffers = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city),
);

export const selectSortedCurrentCityOffers = createSelector(
  [selectCurrentCityOffers, selectSortType],
  (offers, sortType) => sortOffers(offers, sortType),
);

export const selectCurrentCityData = createSelector(
  [selectCurrentCityOffers],
  (offers) => offers[0]?.city ?? null,
);
