import {OfferPreview, OfferDetails} from '../types/offer.ts';
import {Review} from '../types/review.ts';

const BASE_URL = 'https://15.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

export enum APIRoute {
  Offers = '/offers',
  Favorites = '/favorite',
  Comments = '/comments',
  Login = '/login',
  Logout = '/logout',
}

function parseJSON(response: Response): Promise<unknown> {
  return response.json();
}

function checkStatus(response: Response): Response {
  if (response.ok) {
    return response;
  }
  throw new Error(response.statusText);
}

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

function handleError(error: unknown): never {
  if (error instanceof HttpError) {
    throw error;
  }
  throw new Error('Network error');
}

export function getToken(): string {
  const token = localStorage.getItem('six-cities-token');
  return token ?? '';
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestConfig = {
  method: Method;
  endpoint: string;
  body?: unknown;
  requiresAuth?: boolean;
};

async function request<T>({method, endpoint, body, requiresAuth = false}: RequestConfig): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['X-Token'] = token;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...config,
      signal: AbortSignal.timeout(TIMEOUT),
    });

    const result = await parseJSON(response);
    const checkedResponse = checkStatus(response);

    if (!checkedResponse.ok) {
      throw new HttpError(response.status, response.statusText);
    }

    return result as T;
  } catch (error) {
    return handleError(error);
  }
}

export const api = {
  getOffers: () => request<OfferPreview[]>({method: 'GET', endpoint: APIRoute.Offers}),
  getOfferDetails: (id: string) => request<OfferDetails>({method: 'GET', endpoint: `${APIRoute.Offers}/${id}`}),
  getComments: (offerId: string) => request<Review[]>({method: 'GET', endpoint: `${APIRoute.Comments}/${offerId}`}),
  getFavorites: () => request<OfferPreview[]>({method: 'GET', endpoint: APIRoute.Favorites, requiresAuth: true}),
  login: (email: string, password: string) => request<{token: string}>({method: 'POST', endpoint: APIRoute.Login, body: {email, password}}),
  logout: () => request<void>({method: 'POST', endpoint: APIRoute.Logout, requiresAuth: true}),
  addComment: (offerId: string, comment: {comment: string; rating: number}) => request<Review>({method: 'POST', endpoint: `${APIRoute.Comments}/${offerId}`, body: comment, requiresAuth: true}),
  toggleFavorite: (offerId: string, status: 0 | 1) => request<OfferDetails>({method: 'POST', endpoint: `${APIRoute.Favorites}/${offerId}/${status}`, requiresAuth: true}),
};
