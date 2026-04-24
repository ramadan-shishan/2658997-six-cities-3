import { screen } from '@testing-library/react';
import Review from './review.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeReview } from '../../utils/mock-data.ts';

describe('Review', () => {
  it('renders review data', () => {
    const review = makeFakeReview('1');

    renderWithProviders(
      <ul>
        <Review review={review} />
      </ul>,
    );

    expect(screen.getByText(review.user.name)).toBeInTheDocument();
    expect(screen.getByText(review.comment)).toBeInTheDocument();
    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });
});
