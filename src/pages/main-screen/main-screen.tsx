import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/index.ts';
import { changeCity, setSortType } from '../../store/action.ts';
import { fetchOffers, checkAuth } from '../../store/api-actions.ts';
import type { City, SortType } from '../../store/offers-slice.ts';
import Header from '../../components/header/header.tsx';
import Footer from '../../components/footer/footer.tsx';
import Map from '../../components/map/map.tsx';
import LocationsList from '../../components/locations-list/locations-list.tsx';
import SortingList from '../../components/sorting-list/sorting-list.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import Spinner from '../../components/spinner/spinner.tsx';
import './main-screen.css';
import { OfferPreview } from '../../types/offer.ts';
import {
  selectCity,
  selectCurrentCityData,
  selectCurrentCityOffers,
  selectOffersLoading,
  selectSortedCurrentCityOffers,
  selectSortType,
} from '../../store/selectors.ts';

const MainScreen = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const city = useSelector((state: RootState) => selectCity(state));
  const loading = useSelector((state: RootState) => selectOffersLoading(state));
  const sortType = useSelector((state: RootState) => selectSortType(state));
  const currentCityOffers = useSelector((state: RootState) =>
    selectCurrentCityOffers(state),
  );
  const sortedOffers = useSelector((state: RootState) =>
    selectSortedCurrentCityOffers(state),
  );
  const currentCity = useSelector((state: RootState) =>
    selectCurrentCityData(state),
  );
  const [activeOffer, setActiveOffer] = useState<OfferPreview | null>(null);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchOffers());
  }, [dispatch]);

  const handleCityChange = useCallback((newCity: City) => {
    setActiveOffer(null);
    dispatch(changeCity(newCity));
  }, [dispatch]);

  const handleSortChange = useCallback((newSortType: SortType) => {
    dispatch(setSortType(newSortType));
  }, [dispatch]);

  const handleActiveOfferChange = useCallback((offer: OfferPreview | null) => {
    setActiveOffer(offer);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const isEmpty = currentCityOffers.length === 0;

  return (
    <>
      <Header />
      <main
        className={`page__main page__main--index${isEmpty ? ' page__main--index-empty' : ''}`}
      >
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <LocationsList currentCity={city} onCityChange={handleCityChange} />
          </section>
        </div>
        <div className="cities">
          <div
            className={`cities__places-container${isEmpty ? ' cities__places-container--empty' : ''} container`}
          >
            {isEmpty ? (
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">
                    We could not find any property available at the moment in{' '}
                    {city}
                  </p>
                </div>
              </section>
            ) : (
              <>
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
                    onActiveOfferChange={handleActiveOfferChange}
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
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainScreen;
