import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import type { RootState, AppDispatch } from '../../store/index.ts';
import { fetchOfferDetails, fetchComments } from '../../store/api-actions.ts';
import Header from '../../components/header/header.tsx';
import { Offer } from '../../types/offer.ts';
import NotFoundScreen from '../not-found-screen/not-found-screen.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import ReviewForm from '../../components/review-form/review-form.tsx';
import ReviewsList from '../../components/reviews-list/reviews-list.tsx';
import Map from '../../components/map/map.tsx';
import Spinner from '../../components/spinner/spinner.tsx';
import {
  selectCommentsCount,
  selectCurrentOfferDetails,
  selectOffers,
  selectSortedComments,
} from '../../store/selectors.ts';

const OfferScreen = (): React.ReactElement => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const offers = useSelector((state: RootState) => selectOffers(state));
  const currentOfferDetails = useSelector((state: RootState) =>
    selectCurrentOfferDetails(state),
  );
  const comments = useSelector((state: RootState) => selectSortedComments(state));
  const commentsCount = useSelector((state: RootState) => selectCommentsCount(state));
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferDetails(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  const offerDetails = currentOfferDetails;

  const nearbyOffers = useMemo(() => {
    if (!offerDetails) {
      return [];
    }

    return offers
      .filter(
        (offer) =>
          offer.id !== id &&
          offer.city.name === offerDetails.city.name,
      )
      .slice(0, 3);
  }, [offerDetails, offers, id]);

  const mapOffers: Offer[] = offerDetails
    ? [offerDetails, ...nearbyOffers]
    : [];

  const handleActiveOfferChange = useCallback((currentOffer: Offer | null) => {
    setActiveOffer(currentOffer ?? offerDetails);
  }, [offerDetails]);

  if (!id) {
    return <NotFoundScreen />;
  }

  if (!offerDetails) {
    return <Spinner />;
  }

  const ratingWidth = `${Math.round(offerDetails.rating) * 20}%`;

  return (
    <>
      <Helmet>
        <title>6 cities: {offerDetails.title}</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offerDetails.images.slice(0, 6).map((image) => (
                <div className="offer__image-wrapper" key={image}>
                  <img
                    className="offer__image"
                    src={image}
                    alt={offerDetails.title}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offerDetails.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offerDetails.title}</h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {offerDetails.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offerDetails.rating}
                </span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offerDetails.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offerDetails.bedrooms}{' '}
                  {offerDetails.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offerDetails.maxAdults}{' '}
                  {offerDetails.maxAdults === 1 ? 'adult' : 'adults'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offerDetails.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offerDetails.goods.map((good) => (
                    <li className="offer__inside-item" key={good}>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper ${offerDetails.host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={offerDetails.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">
                    {offerDetails.host.name}
                  </span>
                  {offerDetails.host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offerDetails.description}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewsList reviews={comments} reviewsCount={commentsCount} />
                <ReviewForm offerId={id} />
              </section>
            </div>
          </div>
          <Map
            city={offerDetails.city}
            offers={mapOffers}
            selectedOffer={activeOffer ?? offerDetails}
            className="offer__map map"
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <OffersList
              offers={nearbyOffers}
              listClassName="near-places__list places__list"
              cardClassName="near-places__card place-card"
              imageWrapperClassName="near-places__image-wrapper place-card__image-wrapper"
              onActiveOfferChange={handleActiveOfferChange}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default OfferScreen;
