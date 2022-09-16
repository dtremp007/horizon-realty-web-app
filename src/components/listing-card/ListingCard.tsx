import { MouseEventHandler, useMemo } from "react";
import ListingThumbnail from "./ListingThumbnail";
import ListingLocation from "./ListingLocation";
import ListingInfotag from "./ListingInfotag";
import { DocumentData } from "firebase/firestore";
import { FaMapMarkedAlt } from "react-icons/fa";
import { ActionIcon } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Spinner from "../../shared/Spinner";
import InfoTagWrapper from "./InfoTagWrapper"

type Props = {
  id: string;
  data: DocumentData;
  variant: "full" | "map" | "minimal" | "custom";
  className?: string;
};

/**
 * Takes all the data for single listing and renders a card component.
 * This component manages many different views, like full, medium, and small.
 */

export default function ListingCard({
  id,
  data,
  variant = "full",
  className,
}: Props) {
  const {
    title,
    price,
    currency,
    imageUrls,
    landArea,
    landAreaUnits,
    status,
    bedrooms,
    bathrooms,
  } = data;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //I disabled prefetching to save some bandwidth.

  useEffect(() => {
    router.prefetch(`/listings/${id}`);
  }, []);

  const thumbnail = useMemo(() => {
    const regexp = /(\.[^.]*?\?)/
    return imageUrls[0].replace(regexp, "_1280x720.jpeg?")
  }, [imageUrls]);

  const handleClick = () => {
    router.push(`/listings/${id}`);
    setLoading(true);
  };

  return (
    <div
      onClick={handleClick}
      className={`listing-card listing-card--full ${
        "" /*pagesVisited.includes(id) ? "visited" : ""*/
      }`}
    >
      <ListingThumbnail
        price={price}
        currency={currency}
        imageUrl={thumbnail}
        status={status}
      />
      <div className="listing-card__info-wrapper">
        <h3 className="listing-card__h3">{title}</h3>
        <InfoTagWrapper {...data} />
      </div>
      {loading && (
        <Spinner
          style={{
            position: "absolute",
            left: "50%",
            top: "25%",
            transform: "translate(-50%)",
          }}
        />
      )}
    </div>
  );
}

//Positive lookahead not supported on Safari.
function addNBSP(sentence: string) {
  return sentence.replace(/(?<=campo)\s/i, "\u00A0");
}
