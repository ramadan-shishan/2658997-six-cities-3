import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/header.tsx';
import Footer from '../../components/footer/footer.tsx';
import { Helmet } from 'react-helmet-async';
import OffersList from '../../components/offers-list/offers-list.tsx';
import { OfferPreview } from '../../types/offer.ts';
import { AppRoute } from '../../const.ts';

const FavoritesScreen = (): React.ReactElement => {
  const offers: OfferPreview[] = [];
  const favoriteOffers = offers.filter(({ isFavorite }) => isFavorite);
  const favoriteOffersByCity = favoriteOffers.reduce<
    Record<string, OfferPreview[]>
  >((acc, offer) => {
    const cityName = offer.city.name;

    if (!acc[cityName]) {
      acc[cityName] = [];
    }

    acc[cityName].push(offer);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>6 cities: favorites</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {Object.entries(favoriteOffersByCity).map(
                ([city, cityOffers]) => (
                  <li className="favorites__locations-items" key={city}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link
                          className="locations__item-link"
                          to={AppRoute.Main}
                        >
                          <span>{city}</span>
                        </Link>
                      </div>
                    </div>
                    <OffersList
                      offers={cityOffers}
                      listClassName="favorites__places"
                      cardClassName="favorites__card place-card"
                      imageWrapperClassName="favorites__image-wrapper place-card__image-wrapper"
                      infoClassName="favorites__card-info place-card__info"
                      imageWidth={150}
                      imageHeight={110}
                    />
                  </li>
                ),
              )}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FavoritesScreen;
