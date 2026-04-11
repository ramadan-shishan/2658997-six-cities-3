import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import Header from '../../components/header/header.tsx';
import {Offer, OfferDetails, OfferPreview} from '../../types/offer.ts';
import {Review} from '../../types/review.ts';
import NotFoundScreen from '../not-found-screen/not-found-screen.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import ReviewForm from '../../components/review-form/review-form.tsx';
import ReviewsList from '../../components/reviews-list/reviews-list.tsx';
import Map from '../../components/map/map.tsx';

type OfferScreenProps = {
  offers: OfferDetails[];
  previewOffers: OfferPreview[];
  reviews: Review[];
}

const OfferScreen = ({offers, previewOffers, reviews}: OfferScreenProps): React.ReactElement => {
  const {id} = useParams();
  const offer = offers.find((currentOffer) => currentOffer.id === id);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(offer ?? null);

  useEffect(() => {
    setActiveOffer(offer ?? null);
  }, [offer]);

  if (!offer) {
    return <NotFoundScreen />;
  }

  const nearbyOffers = previewOffers.filter((currentOffer) => currentOffer.id !== offer.id).slice(0, 3);
  const mapOffers: Offer[] = [offer, ...nearbyOffers];
  const offerReviews = reviews.filter((review) => review.offerId === offer.id);
  const ratingWidth = `${Math.round(offer.rating) * 20}%`;

  return (
    <>
      <Helmet>
        <title>6 cities: {offer.title}</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.map((image) => (
                <div className="offer__image-wrapper" key={image}>
                  <img className="offer__image" src={image} alt={offer.title}/>
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: ratingWidth}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li className="offer__inside-item" key={good}>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar"/>
                  </div>
                  <span className="offer__user-name">
                    {offer.host.name}
                  </span>
                  {offer.host.isPro && (
                    <span className="offer__user-status">
                      Pro
                    </span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {offer.description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewsList reviews={offerReviews} />
                <ReviewForm />
              </section>
            </div>
          </div>
          <Map
            city={offer.city}
            offers={mapOffers}
            selectedOffer={activeOffer ?? offer}
            className="offer__map map"
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OffersList
              offers={nearbyOffers}
              listClassName="near-places__list places__list"
              cardClassName="near-places__card place-card"
              imageWrapperClassName="near-places__image-wrapper place-card__image-wrapper"
              onActiveOfferChange={(currentOffer) => setActiveOffer(currentOffer ?? offer)}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default OfferScreen;
