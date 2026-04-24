import { screen } from '@testing-library/react';
import OffersList from './offers-list.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeOfferPreview } from '../../utils/mock-data.ts';

describe('OffersList', () => {
  it('renders one card for each offer', () => {
    const offers = [makeFakeOfferPreview('1'), makeFakeOfferPreview('2')];

    renderWithProviders(
      <OffersList
        offers={offers}
        listClassName="places__list"
      />,
    );

    expect(screen.getAllByRole('article')).toHaveLength(offers.length);
    expect(screen.getByText(offers[0].title)).toBeInTheDocument();
    expect(screen.getByText(offers[1].title)).toBeInTheDocument();
  });
});
