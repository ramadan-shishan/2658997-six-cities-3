import { screen } from '@testing-library/react';
import ReviewsList from './reviews-list.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeReview } from '../../utils/mock-data.ts';

describe('ReviewsList', () => {
  it('renders reviews title and list items', () => {
    const reviews = [makeFakeReview('1'), makeFakeReview('2')];

    renderWithProviders(<ReviewsList reviews={reviews} reviewsCount={reviews.length} />);

    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(reviews[0].comment)).toBeInTheDocument();
    expect(screen.getByText(reviews[1].comment)).toBeInTheDocument();
  });
});
