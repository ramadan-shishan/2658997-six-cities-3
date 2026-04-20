import React, { memo } from 'react';
import CityCard from '../city-card/city-card.tsx';
import { OfferPreview } from '../../types/offer.ts';

type OffersListProps = {
  offers: OfferPreview[];
  listClassName: string;
  cardClassName?: string;
  imageWrapperClassName?: string;
  infoClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  onActiveOfferChange?: (offer: OfferPreview | null) => void;
};

const OffersList = ({
  offers,
  listClassName,
  cardClassName,
  imageWrapperClassName,
  infoClassName,
  imageWidth,
  imageHeight,
  onActiveOfferChange,
}: OffersListProps): React.ReactElement => (
  <div className={listClassName}>
    {offers.map((offer) => (
      <CityCard
        key={offer.id}
        offer={offer}
        cardClassName={cardClassName}
        imageWrapperClassName={imageWrapperClassName}
        infoClassName={infoClassName}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        onActiveOfferChange={onActiveOfferChange}
      />
    ))}
  </div>
);

const MemoizedOffersList = memo(OffersList);

export default MemoizedOffersList;
