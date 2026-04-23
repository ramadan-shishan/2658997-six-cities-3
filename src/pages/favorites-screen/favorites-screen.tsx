import React, { useCallback, useEffect, useState } from 'react';
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
  selectFavoritesLoading,
  selectGroupedFavorites,
} from '../../store/selectors.ts';
import FavoritesEmptyState from './components/favorites-empty-state.tsx';
import Spinner from '../../components/spinner/spinner.tsx';

const FavoritesScreen = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);
  const favoriteOffersByCity = useSelector((state: RootState) =>
    selectGroupedFavorites(state),
  );
  const favoritesCount = useSelector((state: RootState) =>
    selectFavoritesCount(state),
  );
  const favoritesError = useSelector((state: RootState) =>
    selectFavoritesError(state),
  );
  const favoritesLoading = useSelector((state: RootState) =>
    selectFavoritesLoading(state),
  );

  useEffect(() => {
    let isActive = true;

    setHasLoadedFavorites(false);
    dispatch(fetchFavorites()).finally(() => {
      if (isActive) {
        setHasLoadedFavorites(true);
      }
    });

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  const handleCityClick = useCallback((city: City) => {
    dispatch(changeCity(city));
  }, [dispatch]);

  const isEmpty = favoritesCount === 0;
  const isLoading = favoritesLoading || !hasLoadedFavorites;
  const hasCriticalError = Boolean(favoritesError) && isEmpty;
  let content: React.ReactElement;

  if (isLoading) {
    content = <Spinner />;
  } else if (hasCriticalError) {
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
