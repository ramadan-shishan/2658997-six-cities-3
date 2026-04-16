import {createSlice} from '@reduxjs/toolkit';
import {OfferPreview} from '../types/offer.ts';
import {CITIES} from '../const.ts';
import {fetchOffers} from './api-actions.ts';

type City = typeof CITIES[number];
type SortType = 'Popular' | 'PriceLowToHigh' | 'PriceHighToLow' | 'TopRated';

interface State {
  city: City;
  offers: OfferPreview[];
  sortType: SortType;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  city: 'Paris',
  offers: [],
  sortType: 'Popular',
  loading: false,
  error: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity: (state, action: {payload: City}) => {
      state.city = action.payload;
    },
    setOffers: (state, action: {payload: OfferPreview[]}) => {
      state.offers = action.payload;
      state.loading = false;
    },
    setSortType: (state, action: {payload: SortType}) => {
      state.sortType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load offers';
      });
  },
});

export const {changeCity, setOffers, setSortType} = offersSlice.actions;
export {offersSlice};
export const offersReducer = offersSlice.reducer;
export type {State, City, SortType};
