import { memo } from 'react';
import Review from '../review/review.tsx';
import { type Review as ReviewType } from '../../types/review.ts';

type ReviewsListProps = {
  reviews: ReviewType[];
  reviewsCount: number;
};

const ReviewsList = ({ reviews, reviewsCount }: ReviewsListProps): JSX.Element => (
  <>
    <h2 className="reviews__title">
      Reviews &middot;{' '}
      <span className="reviews__amount">{reviewsCount}</span>
    </h2>
    <ul className="reviews__list">
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </ul>
  </>
);

const MemoizedReviewsList = memo(ReviewsList);

export default MemoizedReviewsList;
