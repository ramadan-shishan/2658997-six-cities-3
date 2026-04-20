import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { CITIES } from '../const.ts';
import type { OfferPreview, OfferDetails } from '../types/offer.ts';
import { fetchOfferDetails, fetchOffers } from './api-actions.ts';

export type City = typeof CITIES[number];
export type SortType =
  | 'Popular'
  | 'PriceLowToHigh'
  | 'PriceHighToLow'
  | 'TopRated';

export type OffersState = {
  city: City;
  offers: OfferPreview[];
  sortType: SortType;
  loading: boolean;
  error: string | null;
  currentOfferDetails: OfferDetails | null;
};

const initialState: OffersState = {
  city: 'Paris',
  offers: [],
  sortType: 'Popular',
  loading: false,
  error: null,
  currentOfferDetails: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<City>) => {
      state.city = action.payload;
    },
    setOffers: (state, action: PayloadAction<OfferPreview[]>) => {
      state.offers = action.payload;
      state.loading = false;
    },
    setSortType: (state, action: PayloadAction<SortType>) => {
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
      })
      .addCase(fetchOfferDetails.pending, (state) => {
        state.currentOfferDetails = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.currentOfferDetails = action.payload;
      });
  },
});

export const { changeCity, setOffers, setSortType } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;
