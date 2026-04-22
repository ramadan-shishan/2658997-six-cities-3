import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../../components/header/header.tsx';
import Footer from '../../components/footer/footer.tsx';
import { Helmet } from 'react-helmet-async';
import OffersList from '../../components/offers-list/offers-list.tsx';
import ErrorMessage from '../../components/error-message/error-message.tsx';
import { AppRoute } from '../../const.ts';
import type { RootState, AppDispatch } from '../../store/index.ts';
import { fetchFavorites } from '../../store/api-actions.ts';
import { changeCity } from '../../store/action.ts';
import type { City } from '../../store/offers-slice.ts';
import {
  selectFavoritesCount,
  selectFavoritesError,
  selectGroupedFavorites,
} from '../../store/selectors.ts';
import FavoritesEmptyState from './components/favorites-empty-state.tsx';

const FavoritesScreen = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteOffersByCity = useSelector((state: RootState) =>
    selectGroupedFavorites(state),
  );
  const favoritesCount = useSelector((state: RootState) =>
    selectFavoritesCount(state),
  );
  const favoritesError = useSelector((state: RootState) =>
    selectFavoritesError(state),
  );

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleCityClick = useCallback((city: City) => {
    dispatch(changeCity(city));
  }, [dispatch]);

  const isEmpty = favoritesCount === 0;
  const hasCriticalError = Boolean(favoritesError) && isEmpty;
  let content: React.ReactElement;

  if (hasCriticalError) {
    content = (
      <section className="favorites favorites--empty">
        <ErrorMessage message="Server is unavailable. Failed to load favorites." />
      </section>
    );
  } else if (isEmpty) {
    content = <FavoritesEmptyState />;
  } else {
    content = (
      <section className="favorites">
        {favoritesError && (
          <ErrorMessage message="Server is unavailable. Failed to load favorites." />
        )}
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
                      onClick={() => handleCityClick(city)}
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
    );
  }

  return (
    <div className={`page${isEmpty ? ' page--favorites-empty' : ''}`}>
      <Helmet>
        <title>6 cities: favorites</title>
      </Helmet>
      <Header />
      <main
        className={`page__main page__main--favorites${isEmpty ? ' page__main--favorites-empty' : ''}`}
      >
        <div className="page__favorites-container container">
          {content}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesScreen;
