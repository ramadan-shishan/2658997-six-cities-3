import React, {useState} from 'react';

type SortType = 'Popular' | 'PriceLowToHigh' | 'PriceHighToLow' | 'TopRated';

type SortingListProps = {
  currentSort: SortType;
  onSortChange: (sortType: SortType) => void;
};

const SORT_OPTIONS: {label: string; value: SortType}[] = [
  {label: 'Popular', value: 'Popular'},
  {label: 'Price: low to high', value: 'PriceLowToHigh'},
  {label: 'Price: high to low', value: 'PriceHighToLow'},
  {label: 'Top rated first', value: 'TopRated'},
];

const SortingList = ({currentSort, onSortChange}: SortingListProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (sortType: SortType) => {
    onSortChange(sortType);
    setIsOpen(false);
  };

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label ?? 'Popular';

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLabel}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        {SORT_OPTIONS.map((option) => (
          <li
            key={option.value}
            className={`places__option ${option.value === currentSort ? 'places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default SortingList;
export type {SortType};
