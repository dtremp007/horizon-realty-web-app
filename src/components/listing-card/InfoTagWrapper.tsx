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
  electricity,
  water,
}: DocumentData) {

  if ((listingType as string).startsWith("LOTE") || listingType === "LABORES/RANCHOS") {
    return (
      <div className="listing-card__info-tag-wrapper">
        {landArea > 0 && (
          <ListingInfotag
            quantity={landArea}
            variant="land"
            units={landAreaUnits}
          />
        )}
        {
          <ListingInfotag
            quantity=""
            variant={electricity ? "electricity" : "no_electricity"}
          />
        }
        {<ListingInfotag quantity="" variant={water ? "water" : "no_water"} />}
      </div>
    );
  } else {
    return (
      <>
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
          {landArea > 0 && (
            <ListingInfotag
              quantity={landArea}
              variant="land"
              units={landAreaUnits}
            />
          )}
        </div>
      </>
    );
  }
  return null;
}
