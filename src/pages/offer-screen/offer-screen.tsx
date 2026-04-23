import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { AppRoute } from '../../const.ts';
import type { RootState, AppDispatch } from '../../store/index.ts';
import {
  fetchNearbyOffers,
  fetchOfferDetails,
  fetchComments,
} from '../../store/api-actions.ts';
import Header from '../../components/header/header.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import FavoriteButton from '../../components/favorite-button/favorite-button.tsx';
import ReviewForm from '../../components/review-form/review-form.tsx';
import ReviewsList from '../../components/reviews-list/reviews-list.tsx';
import Map from '../../components/map/map.tsx';
import Spinner from '../../components/spinner/spinner.tsx';
import ErrorMessage from '../../components/error-message/error-message.tsx';
import {
  selectCommentsCount,
  selectCurrentOfferDetails,
  selectCurrentOfferDetailsErrorStatus,
  selectCurrentOfferDetailsLoading,
  selectNearbyOffers,
  selectNearbyOffersError,
  selectSortedComments,
} from '../../store/selectors.ts';

const OFFER_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment',
  room: 'Room',
  house: 'House',
  hotel: 'Hotel',
};

const OfferScreen = (): React.ReactElement => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const currentOfferDetails = useSelector((state: RootState) =>
    selectCurrentOfferDetails(state),
  );
  const currentOfferDetailsLoading = useSelector((state: RootState) =>
    selectCurrentOfferDetailsLoading(state),
  );
  const currentOfferDetailsErrorStatus = useSelector((state: RootState) =>
    selectCurrentOfferDetailsErrorStatus(state),
  );
  const nearbyOffers = useSelector((state: RootState) => selectNearbyOffers(state));
  const nearbyOffersError = useSelector((state: RootState) =>
    selectNearbyOffersError(state),
  );
  const comments = useSelector((state: RootState) =>
    selectSortedComments(state),
  );
  const commentsCount = useSelector((state: RootState) =>
    selectCommentsCount(state),
  );
  const commentsError = useSelector((state: RootState) => state.comments.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferDetails(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  const offerDetails = currentOfferDetails;
  const mapOffers = offerDetails ? [offerDetails, ...nearbyOffers] : [];

  if (!id) {
    return <Navigate to={AppRoute.NotFound} replace />;
  }

  if (currentOfferDetailsErrorStatus === 404) {
    return <Navigate to={AppRoute.NotFound} replace />;
  }

  if (currentOfferDetailsLoading || (!offerDetails && currentOfferDetailsErrorStatus === null)) {
    return <Spinner />;
  }

  if (!offerDetails) {
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer">
          <div className="container">
            <ErrorMessage message="Server is unavailable. Failed to load offer details." />
          </div>
        </main>
      </div>
    );
  }

  const ratingWidth = `${Math.round(offerDetails.rating) * 20}%`;
  const offerTypeLabel = OFFER_TYPE_LABELS[offerDetails.type] ?? offerDetails.type;

  return (
    <div className="page">
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
              {(nearbyOffersError || commentsError) && (
                <ErrorMessage message="Some offer data could not be loaded. Please try again later." />
              )}
              {offerDetails.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offerDetails.title}</h1>
                <FavoriteButton
                  offerId={offerDetails.id}
                  isFavorite={offerDetails.isFavorite}
                  buttonClassName="offer__bookmark-button"
                  activeButtonClassName="offer__bookmark-button--active"
                  iconClassName="offer__bookmark-icon"
                  iconWidth={31}
                  iconHeight={33}
                />
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
                  {offerTypeLabel}
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
            selectedOffer={offerDetails}
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
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default OfferScreen;
