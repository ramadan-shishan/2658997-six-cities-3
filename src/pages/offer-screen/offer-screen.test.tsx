import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import OfferScreen from './offer-screen.tsx';
import NotFoundScreen from '../not-found-screen/not-found-screen.tsx';
import { api, APIRoute } from '../../store/api.ts';
import { AuthorizationStatus } from '../../const.ts';
import { renderWithProviders } from '../../utils/test-utils.tsx';
import { makeFakeOfferDetails, makeFakeOfferPreview, makeFakeReview } from '../../utils/mock-data.ts';

vi.mock('../../components/map/map.tsx', () => ({
  default: () => <div data-testid="map" />,
}));

const renderOfferScreen = () => renderWithProviders(
  <Routes>
    <Route path="/offer/:id" element={<OfferScreen />} />
    <Route path="/404" element={<NotFoundScreen />} />
  </Routes>,
  {
    route: '/offer/1',
    preloadedState: {
      user: {
        authorizationStatus: AuthorizationStatus.Auth,
        authToken: 'token',
        email: 'test@test.com',
        loading: false,
      },
    },
  },
);

describe('OfferScreen', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('loads offer details, comments and nearby offers', async () => {
    const offerDetails = {
      ...makeFakeOfferDetails('1'),
      images: [
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
      ],
    };
    const nearbyOffers = [
      makeFakeOfferPreview('2'),
      makeFakeOfferPreview('3'),
      makeFakeOfferPreview('4'),
    ];
    const comments = [makeFakeReview('1'), makeFakeReview('2')];

    mockApi.onGet(`${APIRoute.Offers}/1`).reply(200, offerDetails);
    mockApi.onGet(`${APIRoute.Offers}/1/nearby`).reply(200, nearbyOffers);
    mockApi.onGet(`${APIRoute.Comments}/1`).reply(200, comments);

    renderOfferScreen();

    expect(await screen.findByRole('heading', { name: offerDetails.title })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: offerDetails.title })).toHaveLength(6);
    expect(screen.getByText(offerDetails.description)).toBeInTheDocument();
    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Your review')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
  });

  it('renders not found screen when offer request returns 404', async () => {
    mockApi.onGet(`${APIRoute.Offers}/1`).reply(404);
    mockApi.onGet(`${APIRoute.Offers}/1/nearby`).reply(200, []);
    mockApi.onGet(`${APIRoute.Comments}/1`).reply(200, []);

    renderOfferScreen();

    expect(await screen.findByText('404')).toBeInTheDocument();
  });
});
