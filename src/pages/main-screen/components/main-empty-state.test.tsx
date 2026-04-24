import { screen } from '@testing-library/react';
import MainEmptyState from './main-empty-state.tsx';
import { renderWithProviders } from '../../../utils/test-utils.tsx';

describe('MainEmptyState', () => {
  it('renders empty state text for city', () => {
    renderWithProviders(<MainEmptyState city="Paris" />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(/in Paris/i)).toBeInTheDocument();
  });
});
