import { MouseEventHandler } from "react";
import ListingThumbnail from "./ListingThumbnail";
import ListingLocation from "./ListingLocation";
import ListingInfotag from "./ListingInfotag";
import {DocumentData} from "firebase/firestore"
import {FaMapMarkedAlt} from "react-icons/fa"
import {ActionIcon} from "@mantine/core"
import Link from "next/link";
import {useEffect, useState, useContext} from "react"
import {useRouter} from "next/router"
import Spinner from "../../shared/Spinner";

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
    const {title, price, currency, imageUrls, landArea, status} = data;
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    // const {state} = useContext(NavigationContext)
    // const {pagesVisited} = state;

    useEffect(() => {
        router.prefetch(`/listings/${id}`)
    },[])

    const handleClick = () => {
        router.push(`/listings/${id}`)
        setLoading(true);
  }

  return (
    <div onClick={handleClick} className={`listing-card listing-card--full ${""/*pagesVisited.includes(id) ? "visited" : ""*/}`}>
       <ListingThumbnail price={price} currency={currency} imageUrl={imageUrls[0]} status={status}/>
      <div className="listing-card__info-wrapper">
          <h3 className="listing-card__h3">{title}</h3>
          {/* <ListingLocation /> */}
          <div className="listing-card__info-tag-wrapper">
              <ListingInfotag quantity={landArea} variant="land" />
          </div>
      </div>
      {loading && <Spinner style={{position: "absolute", left: "50%", top: "25%", transform: "translate(-50%)"}}/>}
    </div>
  );
}

//Positive lookahead not supported on Safari.
function addNBSP(sentence:string) {
    return sentence.replace(/(?<=campo)\s/i, "\u00A0")
}
