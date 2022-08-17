import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useContext, useCallback } from "react";
import ListingsContext from "../../context/listingsContext/listingsContext";
import ListingCard from "../listing-card/ListingCard";
import ListingCardAlt from "../listingCardAlt/ListingCardAlt";

const MapListingsOverlay = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const { listingsState, dispatch } = useContext(ListingsContext);
  const { firebaseDocs, scrollToID } = listingsState;

  useEffect(() => {
    let i;
    if (emblaApi) {
    const index = firebaseDocs.findIndex(e => e.id === scrollToID)
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, scrollToID]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {firebaseDocs.map(listing => (
            <div className="embla__slide">
            <ListingCardAlt key={listing.id} data={listing.data} id={listing.id}/>
            </div>
            ))}
      </div>
    </div>
  );
};
export default MapListingsOverlay;
