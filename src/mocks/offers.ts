import {OfferDetails, OfferPreview} from '../types/offer.ts';

const amsterdamLocation = {
  latitude: 52.37454,
  longitude: 4.897976,
  zoom: 12
};

const offers: OfferPreview[] = [
  {
    id: '6af6f711-c28d-4121-82cd-e0b462a27f00',
    title: 'Beautiful & luxurious studio at great location',
    type: 'apartment',
    price: 120,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198,
      zoom: 8
    },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    previewImage: '/img/apartment-01.jpg'
  },
  {
    id: '90d56abc-5f54-4f4d-8d3b-6a8a2f8d1c11',
    title: 'Wood and stone place',
    type: 'room',
    price: 80,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 8
    },
    isFavorite: true,
    isPremium: false,
    rating: 4.2,
    previewImage: '/img/room.jpg'
  },
  {
    id: 'f2ebf6bd-0cad-4f69-a8d0-41c0d72a7c6f',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'apartment',
    price: 180,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.929309666406198,
      zoom: 8
    },
    isFavorite: true,
    isPremium: true,
    rating: 5,
    previewImage: '/img/apartment-03.jpg'
  },
  {
    id: '4a1a5f8a-f4d6-48a8-9f70-0f2e8e95bf3b',
    title: 'Canal View Prinsengracht',
    type: 'apartment',
    price: 132,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3809553943508,
      longitude: 4.939309666406198,
      zoom: 8
    },
    isFavorite: false,
    isPremium: true,
    rating: 4.6,
    previewImage: '/img/apartment-02.jpg'
  }
];

const detailedOffers: OfferDetails[] = [
  {
    id: '6af6f711-c28d-4121-82cd-e0b462a27f00',
    title: 'Beautiful & luxurious studio at great location',
    type: 'apartment',
    price: 120,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198,
      zoom: 8
    },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    description: 'A quiet cozy and picturesque apartment near the canal with soft daylight and a calm atmosphere.',
    bedrooms: 3,
    goods: [
      'Heating',
      'Wi-Fi',
      'Kitchen',
      'Coffee machine'
    ],
    host: {
      name: 'Oliver Conner',
      avatarUrl: '/img/avatar-angelina.jpg',
      isPro: false
    },
    images: [
      '/img/room.jpg',
      '/img/apartment-01.jpg',
      '/img/apartment-02.jpg'
    ],
    maxAdults: 4
  },
  {
    id: '90d56abc-5f54-4f4d-8d3b-6a8a2f8d1c11',
    title: 'Wood and stone place',
    type: 'room',
    price: 80,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 8
    },
    isFavorite: true,
    isPremium: false,
    rating: 4.2,
    description: 'A compact room with warm wooden accents, a comfortable bed and easy access to the city center.',
    bedrooms: 1,
    goods: [
      'Heating',
      'Towels',
      'Wi-Fi'
    ],
    host: {
      name: 'Max Cooper',
      avatarUrl: '/img/avatar-max.jpg',
      isPro: false
    },
    images: [
      '/img/room.jpg',
      '/img/apartment-02.jpg',
      '/img/studio-01.jpg'
    ],
    maxAdults: 2
  },
  {
    id: 'f2ebf6bd-0cad-4f69-a8d0-41c0d72a7c6f',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'apartment',
    price: 180,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.929309666406198,
      zoom: 8
    },
    isFavorite: true,
    isPremium: true,
    rating: 5,
    description: 'A spacious apartment with a large bedroom, quiet street views and enough room for a longer stay.',
    bedrooms: 2,
    goods: [
      'Wi-Fi',
      'Dishwasher',
      'Washing machine',
      'Cable TV'
    ],
    host: {
      name: 'Olivia Stone',
      avatarUrl: '/img/avatar-angelina.jpg',
      isPro: true
    },
    images: [
      '/img/apartment-03.jpg',
      '/img/apartment-01.jpg',
      '/img/studio-photos.jpg'
    ],
    maxAdults: 3
  },
  {
    id: '4a1a5f8a-f4d6-48a8-9f70-0f2e8e95bf3b',
    title: 'Canal View Prinsengracht',
    type: 'apartment',
    price: 132,
    city: {
      name: 'Amsterdam',
      location: amsterdamLocation
    },
    location: {
      latitude: 52.3809553943508,
      longitude: 4.939309666406198,
      zoom: 8
    },
    isFavorite: false,
    isPremium: true,
    rating: 4.6,
    description: 'Bright apartment with canal views, tall windows and a clean, modern interior.',
    bedrooms: 2,
    goods: [
      'Wi-Fi',
      'Heating',
      'Kitchen',
      'Fridge'
    ],
    host: {
      name: 'Sophie Brown',
      avatarUrl: '/img/avatar-max.jpg',
      isPro: true
    },
    images: [
      '/img/apartment-02.jpg',
      '/img/apartment-01.jpg',
      '/img/room.jpg'
    ],
    maxAdults: 4
  }
];

export {offers, detailedOffers};
