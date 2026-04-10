export type ReviewUser = {
  name: string;
  avatarUrl: string;
};

export type Review = {
  id: string;
  offerId: string;
  comment: string;
  date: string;
  rating: number;
  user: ReviewUser;
};
