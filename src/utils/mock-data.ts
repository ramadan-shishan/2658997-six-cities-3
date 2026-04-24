import type { OfferDetails, OfferPreview } from '../types/offer.ts';
import type { Review } from '../types/review.ts';

export const makeFakeOfferPreview = (id = '1'): OfferPreview => ({
  id,
  title: `Offer ${id}`,
  type: 'apartment',
  price: 120,
  city: {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13,
    },
  },
  location: {
    latitude: 48.85661,
    longitude: 2.351499,
    zoom: 13,
  },
  isFavorite: false,
  isPremium: true,
  rating: 4.2,
  previewImage: '/img/apartment-01.jpg',
});

export const makeFakeOfferDetails = (id = '1'): OfferDetails => ({
  ...makeFakeOfferPreview(id),
  description: 'A quiet place to stay',
  bedrooms: 2,
  goods: ['Wi-Fi', 'Kitchen'],
  host: {
    name: 'John',
    avatarUrl: '/img/avatar.svg',
    isPro: true,
  },
  images: [
    '/img/apartment-01.jpg',
    '/img/apartment-02.jpg',
    '/img/apartment-03.jpg',
  ],
  maxAdults: 3,
});

export const makeFakeReview = (id = '1'): Review => ({
  id,
  offerId: '1',
  comment: `Review comment ${id}`,
  date: '2024-01-15T12:00:00.000Z',
  rating: 4,
  user: {
    name: `User ${id}`,
    avatarUrl: '/img/avatar.svg',
  },
});
