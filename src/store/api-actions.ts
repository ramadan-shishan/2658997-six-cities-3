import {createAsyncThunk} from '@reduxjs/toolkit';
import {OfferPreview} from '../types/offer.ts';
import {api, APIRoute} from './api.ts';

export const fetchOffers = createAsyncThunk<OfferPreview[], undefined>(
  'offers/fetchOffers',
  async () => {
    const response = await api.get<OfferPreview[]>(APIRoute.Offers);
    return response.data;
  }
);
