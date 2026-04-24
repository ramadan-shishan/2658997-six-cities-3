import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortingList from './sorting-list.tsx';
import { renderWithProviders } from '../../utils/test-utils.tsx';

describe('SortingList', () => {
  it('renders current sort label and all options', () => {
    renderWithProviders(
      <SortingList currentSort="Popular" onSortChange={vi.fn()} />,
    );

    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getAllByText('Popular')).toHaveLength(2);
    expect(screen.getByText('Price: low to high')).toBeInTheDocument();
    expect(screen.getByText('Price: high to low')).toBeInTheDocument();
    expect(screen.getByText('Top rated first')).toBeInTheDocument();
  });

  it('opens list and calls callback after sort option click', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();
    const { container } = renderWithProviders(
      <SortingList currentSort="Popular" onSortChange={handleSortChange} />,
    );

    expect(container.querySelector('.places__options--opened')).not.toBeInTheDocument();

    await user.click(container.querySelector('.places__sorting-type') as HTMLElement);

    expect(container.querySelector('.places__options--opened')).toBeInTheDocument();

    await user.click(screen.getByText('Top rated first'));

    expect(handleSortChange).toHaveBeenCalledWith('TopRated');
    expect(container.querySelector('.places__options--opened')).not.toBeInTheDocument();
  });
});
