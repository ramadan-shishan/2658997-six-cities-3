import React, { memo, useCallback } from 'react';
import {generatePath, Link} from 'react-router-dom';
import {AppRoute} from '../../const.ts';
import {OfferPreview} from '../../types/offer.ts';

type CityCardProps = {
  offer: OfferPreview;
  cardClassName?: string;
  imageWrapperClassName?: string;
  infoClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  onActiveOfferChange?: (offer: OfferPreview | null) => void;
}

const CityCard = ({
  offer,
  cardClassName = 'cities__card place-card',
  imageWrapperClassName = 'cities__image-wrapper place-card__image-wrapper',
  infoClassName = 'place-card__info',
  imageWidth = 260,
  imageHeight = 200,
  onActiveOfferChange
}: CityCardProps): React.ReactElement => {
  const offerLink = generatePath(AppRoute.Offer, {id: offer.id});
  const ratingWidth = `${Math.round(offer.rating) * 20}%`;
  const handleMouseEnter = useCallback(() => {
    onActiveOfferChange?.(offer);
  }, [offer, onActiveOfferChange]);
  const handleMouseLeave = useCallback(() => {
    onActiveOfferChange?.(null);
  }, [onActiveOfferChange]);

  return (
    <article
      className={cardClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={imageWrapperClassName}>
        <Link to={offerLink}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width={imageWidth}
            height={imageHeight}
            alt={offer.title}
          />
        </Link>
      </div>
      <div className={infoClassName}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button ${offer.isFavorite ? 'place-card__bookmark-button--active' : ''} button`}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: ratingWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={offerLink}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
};

const MemoizedCityCard = memo(CityCard);

export default MemoizedCityCard;
