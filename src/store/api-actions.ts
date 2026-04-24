import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {OfferPreview, OfferDetails} from '../types/offer.ts';
import {Review} from '../types/review.ts';
import {api, APIRoute, saveToken, dropToken} from './api.ts';

export const fetchOffers = createAsyncThunk<OfferPreview[], undefined>(
  'offers/fetchOffers',
  async () => {
    const response = await api.get<OfferPreview[]>(APIRoute.Offers);
    return response.data;
  }
);

export const checkAuth = createAsyncThunk<{token: string; email: string}, undefined>(
  'user/checkAuth',
  async () => {
    const response = await api.get<{token: string; email: string}>(APIRoute.Login);
    saveToken(response.data.token);
    return response.data;
  }
);

export const login = createAsyncThunk<{token: string; email: string}, {email: string; password: string}>(
  'user/login',
  async ({email, password}) => {
    const response = await api.post<{token: string; email: string}>(APIRoute.Login, {email, password});
    saveToken(response.data.token);
    return response.data;
  }
);

export const logout = createAsyncThunk<void, undefined>(
  'user/logout',
  async () => {
    try {
      await api.post(APIRoute.Logout);
    } catch {
      // no-op: local session must be terminated even if server logout fails
    } finally {
      dropToken();
    }
  }
);

export const fetchOfferDetails = createAsyncThunk<
  OfferDetails,
  string,
  { rejectValue: number | null }
>(
  'offers/fetchOfferDetails',
  async (offerId, { rejectWithValue }) => {
    try {
      const response = await api.get<OfferDetails>(`${APIRoute.Offers}/${offerId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.status ?? null);
    }
  }
);

export const fetchNearbyOffers = createAsyncThunk<OfferPreview[], string>(
  'offers/fetchNearbyOffers',
  async (offerId) => {
    const response = await api.get<OfferPreview[]>(
      `${APIRoute.Offers}/${offerId}/nearby`
    );
    return response.data;
  }
);

export const fetchFavorites = createAsyncThunk<OfferPreview[], undefined>(
  'favorites/fetchFavorites',
  async () => {
    const response = await api.get<OfferPreview[]>(APIRoute.Favorites);
    return response.data;
  }
);

export const toggleFavoriteStatus = createAsyncThunk<
  OfferDetails,
  {offerId: string; status: 0 | 1}
>(
  'favorites/toggleFavoriteStatus',
  async ({offerId, status}, {dispatch}) => {
    const response = await api.post<OfferDetails>(`${APIRoute.Favorites}/${offerId}/${status}`);

    if (status === 1) {
      await dispatch(fetchFavorites());
    }

    return response.data;
  }
);

export const fetchComments = createAsyncThunk<Review[], string>(
  'comments/fetchComments',
  async (offerId) => {
    const response = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
    return response.data;
  }
);

export const addComment = createAsyncThunk<Review, {offerId: string; comment: string; rating: number}>(
  'comments/addComment',
  async ({offerId, comment, rating}) => {
    const response = await api.post<Review>(`${APIRoute.Comments}/${offerId}`, {comment, rating});
    return response.data;
  }
);
