import { screen } from '@testing-library/react';
import ReviewForm from './review-form.tsx';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('ReviewForm', () => {
  it('renders form for authorized user', () => {
    renderWithProviders(<ReviewForm offerId="1" />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.Auth,
          authToken: 'token',
          email: 'test@test.com',
          loading: false,
        },
      },
    });

    expect(screen.getByText('Your review')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders nothing for unauthorized user', () => {
    const { container } = renderWithProviders(<ReviewForm offerId="1" />, {
      preloadedState: {
        user: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          authToken: null,
          email: null,
          loading: false,
        },
      },
    });

    expect(container).toBeEmptyDOMElement();
  });
});
