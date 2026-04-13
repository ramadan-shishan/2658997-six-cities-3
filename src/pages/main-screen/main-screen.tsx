import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/index.ts';
import { changeCity } from '../../store/action.ts';
import { fetchOffers } from '../../store/api-actions.ts';
import Header from '../../components/header/header.tsx';
import Footer from '../../components/footer/footer.tsx';
import Map from '../../components/map/map.tsx';
import LocationsList from '../../components/locations-list/locations-list.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import { OfferPreview } from '../../types/offer.ts';

const MainScreen = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const { city, offers, loading } = useSelector(
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

  const handleCityChange = (newCity: string) => {
    dispatch(changeCity(newCity));
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
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li
                    className="places__option places__option--active"
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>
              <OffersList
                offers={currentCityOffers}
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
