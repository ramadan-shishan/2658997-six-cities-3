import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/index.ts';
import { changeCity, setSortType } from '../../store/action.ts';
import { fetchOffers } from '../../store/api-actions.ts';
import type { SortType } from '../../store/reducer.ts';
import Header from '../../components/header/header.tsx';
import Footer from '../../components/footer/footer.tsx';
import Map from '../../components/map/map.tsx';
import LocationsList from '../../components/locations-list/locations-list.tsx';
import SortingList from '../../components/sorting-list/sorting-list.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import { OfferPreview } from '../../types/offer.ts';

const MainScreen = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const { city, offers, loading, sortType } = useSelector(
    (state: RootState) => state.offers,
  );
  const [activeOffer, setActiveOffer] = useState<OfferPreview | null>(null);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const currentCityOffers = offers.filter(
    ({ city: offerCity }) => offerCity.name === city,
  );
  const currentCity = currentCityOffers[0]?.city;

  const sortedOffers = useMemo(() => {
    const sorted = [...currentCityOffers];
    switch (sortType) {
      case 'PriceLowToHigh':
        return sorted.sort((a, b) => a.price - b.price);
      case 'PriceHighToLow':
        return sorted.sort((a, b) => b.price - a.price);
      case 'TopRated':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [currentCityOffers, sortType]);

  const handleCityChange = (newCity: string) => {
    dispatch(changeCity(newCity));
  };

  const handleSortChange = (newSortType: SortType) => {
    dispatch(setSortType(newSortType));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <LocationsList currentCity={city} onCityChange={handleCityChange} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {currentCityOffers.length} places to stay in {city}
              </b>
              <SortingList
                currentSort={sortType}
                onSortChange={handleSortChange}
              />
              <OffersList
                offers={sortedOffers}
                listClassName="cities__places-list places__list tabs__content"
                onActiveOfferChange={setActiveOffer}
              />
            </section>
            <div className="cities__right-section">
              {currentCity && (
                <Map
                  city={currentCity}
                  offers={currentCityOffers}
                  selectedOffer={activeOffer}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainScreen;
