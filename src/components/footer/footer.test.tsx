import { screen } from '@testing-library/react';
import Footer from './footer.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('Footer', () => {
  it('renders logo link to main page', () => {
    renderWithProviders(<Footer />);

    const logo = screen.getByRole('img', { name: /6 cities logo/i });

    expect(logo).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
