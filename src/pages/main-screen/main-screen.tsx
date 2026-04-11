import React, { useState } from 'react';
import { CITIES } from '../../const';
import Header from '../../components/header/header.tsx';
import Footer from '../../components/footer/footer.tsx';
import Map from '../../components/map/map.tsx';
import Location from './components/location.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import { OfferPreview } from '../../types/offer.ts';

type MainScreenProps = {
  offers: OfferPreview[];
};

const MainScreen = ({ offers }: MainScreenProps): React.ReactElement => {
  const [activeOffer, setActiveOffer] = useState<OfferPreview | null>(null);
  const currentCityOffers = offers.filter(
    ({ city }) => city.name === 'Amsterdam',
  );
  const currentCity = currentCityOffers[0]?.city;

  return (
    <>
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              {CITIES.map((cityItem) => (
                <Location key={cityItem} city={cityItem} />
              ))}
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {currentCityOffers.length} places to stay in Amsterdam
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
