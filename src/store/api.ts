import axios, {AxiosInstance} from 'axios';
import {OfferPreview, OfferDetails} from '../types/offer.ts';
import {Review} from '../types/review.ts';

const BASE_URL = 'https://15.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export enum APIRoute {
  Offers = '/offers',
  Favorites = '/favorite',
  Comments = '/comments',
  Login = '/login',
  Logout = '/logout',
}

export const apiActions = {
  getOffers: () => api.get<OfferPreview[]>(APIRoute.Offers),
  getOfferDetails: (id: string) => api.get<OfferDetails>(`${APIRoute.Offers}/${id}`),
  getComments: (offerId: string) => api.get<Review[]>(`${APIRoute.Comments}/${offerId}`),
  getFavorites: () => api.get<OfferPreview[]>(APIRoute.Favorites),
  login: (email: string, password: string) => api.post<{token: string}>(APIRoute.Login, {email, password}),
  logout: () => api.post(APIRoute.Logout),
  addComment: (offerId: string, comment: {comment: string; rating: number}) =>
    api.post<Review>(`${APIRoute.Comments}/${offerId}`, comment),
  toggleFavorite: (offerId: string, status: 0 | 1) =>
    api.post<OfferDetails>(`${APIRoute.Favorites}/${offerId}/${status}`),
};

