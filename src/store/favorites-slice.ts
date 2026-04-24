import { createSlice } from '@reduxjs/toolkit';
import type { OfferPreview } from '../types/offer.ts';
import {
  checkAuth,
  fetchFavorites,
  login,
  logout,
  toggleFavoriteStatus,
} from './api-actions.ts';

export type FavoritesState = {
  favorites: OfferPreview[];
  loading: boolean;
  error: string | null;
  updatingOfferIds: string[];
};

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
  updatingOfferIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load favorites';
      })
      .addCase(toggleFavoriteStatus.pending, (state, action) => {
        state.updatingOfferIds.push(action.meta.arg.offerId);
      })
      .addCase(toggleFavoriteStatus.fulfilled, (state, action) => {
        state.updatingOfferIds = state.updatingOfferIds.filter(
          (offerId) => offerId !== action.meta.arg.offerId,
        );

        if (!action.payload.isFavorite) {
          state.favorites = state.favorites.filter(
            (offer) => offer.id !== action.payload.id,
          );
        }
      })
      .addCase(toggleFavoriteStatus.rejected, (state, action) => {
        state.updatingOfferIds = state.updatingOfferIds.filter(
          (offerId) => offerId !== action.meta.arg.offerId,
        );
      })
      .addCase(checkAuth.rejected, (state) => {
        state.favorites = [];
        state.updatingOfferIds = [];
      })
      .addCase(login.rejected, (state) => {
        state.favorites = [];
        state.updatingOfferIds = [];
      })
      .addCase(logout.fulfilled, (state) => {
        state.favorites = [];
        state.updatingOfferIds = [];
      })
      .addCase(logout.rejected, (state) => {
        state.favorites = [];
        state.updatingOfferIds = [];
      });
  },
});

export const favoritesReducer = favoritesSlice.reducer;
