import Review from '../review/review.tsx';
import { type Review as ReviewType } from '../../types/review.ts';

type ReviewsListProps = {
  reviews: ReviewType[];
};

const ReviewsList = ({ reviews }: ReviewsListProps): JSX.Element => {
  const sortedReviews = [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <>
      <h2 className="reviews__title">
        Reviews &middot;{' '}
        <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ul className="reviews__list">
        {sortedReviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </ul>
    </>
  );
};

export default ReviewsList;
