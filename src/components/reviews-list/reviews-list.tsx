import Review from '../review/review.tsx';
import {type Review as ReviewType} from '../../types/review.ts';

type ReviewsListProps = {
  reviews: ReviewType[];
};

const ReviewsList = ({reviews}: ReviewsListProps): JSX.Element => (
  <>
    <h2 className="reviews__title">
      Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
    </h2>
    <ul className="reviews__list">
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </ul>
  </>
);

export default ReviewsList;
