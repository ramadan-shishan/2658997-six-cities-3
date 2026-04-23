import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CityCard from './city-card.tsx';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeOfferPreview } from '../../utils/mock-data.ts';

describe('CityCard', () => {
  it('renders offer data and link to offer page', () => {
    const offer = makeFakeOfferPreview('42');

    renderWithProviders(<CityCard offer={offer} />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    expect(screen.getByRole('img', { name: offer.title })).toHaveAttribute(
      'src',
      offer.previewImage,
    );
    expect(screen.getByText(`€${offer.price}`)).toBeInTheDocument();
    screen
      .getAllByRole('link', { name: offer.title })
      .forEach((link) => {
        expect(link).toHaveAttribute('href', `/offer/${offer.id}`);
      });
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('notifies about hovered offer', async () => {
    const user = userEvent.setup();
    const offer = makeFakeOfferPreview('1');
    const handleActiveOfferChange = vi.fn();

    renderWithProviders(
      <CityCard
        offer={offer}
        onActiveOfferChange={handleActiveOfferChange}
      />,
    );

    await user.hover(screen.getByRole('article'));

    expect(handleActiveOfferChange).toHaveBeenCalledWith(offer);

    await user.unhover(screen.getByRole('article'));

    expect(handleActiveOfferChange).toHaveBeenLastCalledWith(null);
  });
});
