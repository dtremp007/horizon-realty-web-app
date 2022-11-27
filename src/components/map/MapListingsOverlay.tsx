import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useContext, useCallback } from "react";
import ListingsContext from "../../context/listingsContext/listingsContext";
import ListingCard from "../listing-card/ListingCard";
import ListingCardAlt from "../listingCardAlt/ListingCardAlt";
import { ListingsState } from "../../context/listingsContext/listingsContext";
import { distanceFromBasePoint } from "../../layouts/ListingsLayout";

const MapListingsOverlay = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const { listingsState, dispatch } = useContext(ListingsContext);
  const { firebaseDocs, mapFocusPoint } = listingsState;

  useEffect(() => {
    if (emblaApi && mapFocusPoint.sender === "map") {
      emblaApi.scrollTo(mapFocusPoint.index);
    }
  }, [emblaApi, mapFocusPoint]);

  useEffect(() => {
    function handleScroll() {
      const payload = {
        sender: "carousel",
        index: emblaApi?.selectedScrollSnap(),
      };

      dispatch({ type: "UPDATE_MAP_FOCUS_POINT", payload });
    }

    if (emblaApi) {
      emblaApi.on("select", handleScroll);
    }

    return () => {
      if (emblaApi) {
        emblaApi.off("select", handleScroll);
      }
    };
  });

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {firebaseDocs
          .sort(
            (a, b) =>
              distanceFromBasePoint(a.data.coordinates) -
              distanceFromBasePoint(b.data.coordinates)
          )
          .map((listing) => (
            <div className="embla__slide" key={listing.id}>
              <ListingCardAlt data={listing.data} id={listing.id} />
            </div>
          ))}
      </div>
    </div>
  );
};
export default MapListingsOverlay;
