import {AppDispatch} from './index.ts';
import {api} from './api.ts';

export const fetchOffers = () => async (dispatch: AppDispatch) => {
  dispatch({type: 'FETCH_OFFERS_PENDING'});
  try {
    const offers = await api.getOffers();
    dispatch({type: 'SET_OFFERS', payload: offers});
    dispatch({type: 'FETCH_OFFERS_FULFILLED'});
  } catch {
    dispatch({type: 'FETCH_OFFERS_REJECTED'});
  }
};
