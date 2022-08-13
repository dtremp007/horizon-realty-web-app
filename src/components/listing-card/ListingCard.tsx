import { MouseEventHandler } from "react";
import ListingThumbnail from "./ListingThumbnail";
import ListingLocation from "./ListingLocation";
import ListingInfotag from "./ListingInfotag";
import {DocumentData} from "firebase/firestore"

type Props = {
  data: DocumentData
  variant: "full" | "map" | "minimal" | "custom";
  className?: string;
  onClick?: MouseEventHandler;
};

/**
 * Takes all the data for single listing and renders a card component.
 * This component manages many different views, like full, medium, and small.
 */

export default function ListingCard({
  data,
  variant = "full",
  className,
  onClick,
}: Props) {
    const {title, price, currency, imageUrls, landArea} = data;

  return (
    <div onClick={onClick} className={createClassList(variant, className)}>
      <ListingThumbnail price={price} currency={currency} imageUrl={imageUrls[0]}/>
      <div className="listing-card__info-wrapper">
          <h3 className="listing-card__h3">{title}</h3>
          <ListingLocation />
          <div className="listing-card__info-tag-wrapper">
              <ListingInfotag quantity={landArea} variant="land" />
          </div>
      </div>
    </div>
  );
}

const createClassList = (variant: string, className?: string) => {
  if (variant === "custom") {
    return className;
  } else if (variant === "full") {
    return `listing-card listing-card--full ${className || ""}`;
  } else if (variant === "map") {
    return `listing-card listing-card--map ${className || ""}`;
  } else if (variant === "minimal") {
    return `listing-card listing-card--minimal ${className || ""}`;
  }
};
