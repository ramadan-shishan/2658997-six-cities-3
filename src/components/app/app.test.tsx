import { screen } from '@testing-library/react';
import { AppRoutes } from './app.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';

vi.mock('../../pages/main-screen/main-screen.tsx', () => ({
  default: () => <div>Main screen</div>,
}));

describe('AppRoutes', () => {
  it('redirects unknown route to not found page', async () => {
    renderWithProviders(<AppRoutes />, { route: '/unknown-route' });

    expect(await screen.findByText('404')).toBeInTheDocument();
  });

  it('renders main screen for main route', () => {
    renderWithProviders(<AppRoutes />);

    expect(screen.getByText('Main screen')).toBeInTheDocument();
  });
});
