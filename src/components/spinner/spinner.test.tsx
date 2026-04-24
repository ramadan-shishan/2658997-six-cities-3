import { screen } from '@testing-library/react';
import Spinner from './spinner.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('Spinner', () => {
  it('renders loading text', () => {
    renderWithProviders(<Spinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
