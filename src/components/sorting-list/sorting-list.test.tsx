import { screen } from '@testing-library/react';
import SortingList from './sorting-list.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('SortingList', () => {
  it('renders current sort label and all options', () => {
    renderWithProviders(
      <SortingList currentSort="Popular" onSortChange={vi.fn()} />,
    );

    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Price: low to high')).toBeInTheDocument();
    expect(screen.getByText('Price: high to low')).toBeInTheDocument();
    expect(screen.getByText('Top rated first')).toBeInTheDocument();
  });
});
