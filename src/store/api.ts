import axios, {AxiosInstance, AxiosError} from 'axios';
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

const TOKEN_KEY = 'six-cities-token';

export function getToken(): string {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ?? '';
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function dropToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['X-Token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      dropToken();
    }
    throw error;
  }
);

export const apiActions = {
  getOffers: () => api.get<OfferPreview[]>(APIRoute.Offers),
  getOfferDetails: (id: string) => api.get<OfferDetails>(`${APIRoute.Offers}/${id}`),
  getComments: (offerId: string) => api.get<Review[]>(`${APIRoute.Comments}/${offerId}`),
  getFavorites: () => api.get<OfferPreview[]>(APIRoute.Favorites),
  checkAuth: () => api.get<{token: string; email: string}>(APIRoute.Login),
  login: (email: string, password: string) => api.post<{token: string; email: string}>(APIRoute.Login, {email, password}),
  logout: () => api.post(APIRoute.Logout),
  addComment: (offerId: string, comment: {comment: string; rating: number}) =>
    api.post<Review>(`${APIRoute.Comments}/${offerId}`, comment),
  toggleFavorite: (offerId: string, status: 0 | 1) =>
    api.post<OfferDetails>(`${APIRoute.Favorites}/${offerId}/${status}`),
};

