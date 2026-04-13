import {City} from './reducer.ts';
import {OfferPreview} from '../types/offer.ts';

export const changeCity = (city: City) => ({
  type: 'CHANGE_CITY' as const,
  payload: city,
});

export const setOffers = (offers: OfferPreview[]) => ({
  type: 'SET_OFFERS' as const,
  payload: offers,
});
