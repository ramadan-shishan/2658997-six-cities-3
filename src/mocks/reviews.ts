import {type Review} from '../types/review.ts';

const reviews: Review[] = [
  {
    id: '35e5625d-75d4-4704-b28f-a56d56ec61b0',
    offerId: '6af6f711-c28d-4121-82cd-e0b462a27f00',
    comment: 'A quiet cozy and picturesque place with a good location and enough space for a comfortable stay.',
    date: '2019-04-24',
    rating: 4,
    user: {
      name: 'Max',
      avatarUrl: '/img/avatar-max.jpg'
    }
  },
  {
    id: '9f60991d-fda7-4301-8425-c2b18f60da32',
    offerId: '6af6f711-c28d-4121-82cd-e0b462a27f00',
    comment: 'Lovely apartment with soft daylight in the mornings. The canal nearby made evening walks especially pleasant.',
    date: '2020-02-14',
    rating: 5,
    user: {
      name: 'Angelina',
      avatarUrl: '/img/avatar-angelina.jpg'
    }
  },
  {
    id: '7a0dcdd8-5783-421a-a17f-8490b0413809',
    offerId: '90d56abc-5f54-4f4d-8d3b-6a8a2f8d1c11',
    comment: 'Compact and warm room, perfect for a short trip. Everything was neat and the host was very welcoming.',
    date: '2021-01-09',
    rating: 4,
    user: {
      name: 'Sophie',
      avatarUrl: '/img/avatar-max.jpg'
    }
  },
  {
    id: '6d1e5639-6af6-4bcc-a2f2-39107f9a225f',
    offerId: 'f2ebf6bd-0cad-4f69-a8d0-41c0d72a7c6f',
    comment: 'Spacious, quiet and very comfortable for a longer stay. The bedroom and kitchen were especially good.',
    date: '2022-06-03',
    rating: 5,
    user: {
      name: 'Olivia',
      avatarUrl: '/img/avatar-angelina.jpg'
    }
  },
  {
    id: 'c6154647-dd03-4503-ae9e-c08db908ecfd',
    offerId: '4a1a5f8a-f4d6-48a8-9f70-0f2e8e95bf3b',
    comment: 'The canal view is exactly what makes this apartment special. Bright rooms, clean interior and a calm street.',
    date: '2023-08-18',
    rating: 5,
    user: {
      name: 'Emma',
      avatarUrl: '/img/avatar-max.jpg'
    }
  }
];

export {reviews};
