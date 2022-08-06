import { MouseEventHandler } from "react";
import ListingThumbnail from "./ListingThumbnail";
import ListingLocation from "./ListingLocation";
import ListingInfotag from "./ListingInfotag";

type Props = {
  data?: string; //Obviously not. Please create a proper interface.
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
  return (
    <div onClick={onClick} className={createClassList(variant, className)}>
      <ListingThumbnail />
      <div className="listing-card__info-wrapper">
          <h3 className="listing-card__h3">#40 Campo 3B</h3>
          <ListingLocation />
          <div className="listing-card__info-tag-wrapper">
              <ListingInfotag quantity={3} variant="bedroom" />
              <ListingInfotag quantity={2} variant="bathroom" />
              <ListingInfotag quantity={1234} variant="area" />
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
