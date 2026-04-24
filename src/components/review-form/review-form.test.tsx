import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import ReviewForm from './review-form.tsx';
import { AuthorizationStatus } from '../../const.ts';
import { api, APIRoute } from '../../store/api.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeReview } from '../../utils/mock-data.ts';

describe('ReviewForm', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

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
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
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

  it('enables submit after valid rating and review, then clears form after success', async () => {
    const user = userEvent.setup();
    const reviewText = 'A comfortable apartment with a helpful host and a very convenient location.';

    mockApi.onPost(`${APIRoute.Comments}/1`).reply(200, makeFakeReview('3'));
    mockApi.onGet(`${APIRoute.Comments}/1`).reply(200, [makeFakeReview('1')]);

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

    await user.click(screen.getByTitle('perfect'));
    await user.type(screen.getByPlaceholderText(/Tell how was your stay/i), reviewText);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toHaveValue('');
  });

  it('keeps submit disabled when review is longer than allowed', async () => {
    const user = userEvent.setup();

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

    await user.click(screen.getByTitle('perfect'));
    fireEvent.change(screen.getByPlaceholderText(/Tell how was your stay/i), {
      target: { value: 'a'.repeat(301) },
    });

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});
