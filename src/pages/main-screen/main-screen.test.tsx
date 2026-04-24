import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import MainScreen from './main-screen.tsx';
import { api, APIRoute } from '../../store/api.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeOfferPreview } from '../../utils/mock-data.ts';

vi.mock('../../components/map/map.tsx', () => ({
  default: () => <div data-testid="map" />,
}));

describe('MainScreen', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('loads offers and changes active city after city click', async () => {
    const user = userEvent.setup();
    const parisOffer = makeFakeOfferPreview('1');
    const amsterdamOffer = {
      ...makeFakeOfferPreview('2'),
      title: 'Amsterdam offer',
      city: {
        name: 'Amsterdam',
        location: {
          latitude: 52.370216,
          longitude: 4.895168,
          zoom: 12,
        },
      },
    };

    mockApi.onGet(APIRoute.Offers).reply(200, [parisOffer, amsterdamOffer]);

    const { store } = renderWithProviders(<MainScreen />);

    expect(await screen.findByText('1 place to stay in Paris')).toBeInTheDocument();

    await user.click(screen.getByText('Amsterdam'));

    expect(screen.getByText('1 place to stay in Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam offer')).toBeInTheDocument();
    expect(store.getState().offers.city).toBe('Amsterdam');
  });

  it('shows server error message when offers cannot be loaded', async () => {
    mockApi.onGet(APIRoute.Offers).reply(500);

    renderWithProviders(<MainScreen />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Server is unavailable. Failed to load offers.',
      );
    });
  });
});
