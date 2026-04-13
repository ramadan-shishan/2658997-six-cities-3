import {OfferPreview} from '../types/offer.ts';
import {CITIES} from '../const.ts';

type City = typeof CITIES[number];

interface State {
  city: City;
  offers: OfferPreview[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  city: 'Paris',
  offers: [],
  loading: false,
  error: null,
};

type Action =
  | {type: 'CHANGE_CITY'; payload: City}
  | {type: 'SET_OFFERS'; payload: OfferPreview[]}
  | {type: 'FETCH_OFFERS_PENDING'}
  | {type: 'FETCH_OFFERS_FULFILLED'}
  | {type: 'FETCH_OFFERS_REJECTED'};

function offersReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case 'CHANGE_CITY':
      return {
        ...state,
        city: action.payload,
      };
    case 'SET_OFFERS':
      return {
        ...state,
        offers: action.payload,
        loading: false,
      };
    case 'FETCH_OFFERS_PENDING':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_OFFERS_FULFILLED':
      return {
        ...state,
        loading: false,
      };
    case 'FETCH_OFFERS_REJECTED':
      return {
        ...state,
        loading: false,
        error: 'Failed to load offers',
      };
    default:
      return state;
  }
}

export {initialState, offersReducer};
export type {State, Action, City};
