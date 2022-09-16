import { DocumentData } from "firebase/firestore";
import ListingInfotag from "./ListingInfotag";

export default function InfoTagWrapper({
    listingType,
    bedrooms,
    bathrooms,
    landArea,
    landAreaUnits,
    houseSize,
    houseSizeUnits,
  }: DocumentData) {
    if (listingType === "CASA") {
      return (
        <div className="listing-card__info-tag-wrapper">
          {bedrooms > 0 && (
            <ListingInfotag quantity={bedrooms} variant="bedroom" />
          )}
          {bathrooms > 0 && (
            <ListingInfotag quantity={bathrooms} variant="bathroom" />
          )}
          {houseSize > 0 && (
            <ListingInfotag
              quantity={houseSize}
              variant="area"
              units={houseSizeUnits}
            />
          )}
        </div>
      );
    }

    if (listingType === "LOTE") {
      return (
        <div className="listing-card__info-tag-wrapper">
          {landArea > 0 && (
            <ListingInfotag
              quantity={landArea}
              variant="land"
              units={landAreaUnits}
            />
          )}
        </div>
      );
    }

    return null;
  }
