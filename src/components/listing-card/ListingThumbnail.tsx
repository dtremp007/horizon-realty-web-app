import ListingActionItems from "./ListingActionItems"
import Image from "next/image";
import houseThumbnail from "../../../public/country-home-unsplash.jpg"
import Show from "../HOC/Show"
import { getToggleFunction } from "../../../lib/util";

type Props = {
    imageUrl: string;
    price: number;
    currency: string;
    status: string;
    availability: "sold" | "available" | "pending";
}

export default function ListingThumbnail({imageUrl, price, currency, status, availability: availibility}: Props) {
    const toggleSold = getToggleFunction("listing-card--sold", availibility === "sold" ? true : false)

  return (
    <div className="listing-card__thumbnail">
        <Image src={process.env.NODE_ENV === "development" ? houseThumbnail : imageUrl} layout="fill" objectFit="cover" alt="thumbnail"/>
        <div className={toggleSold("listing-card__thumbnail-overlay")}>
            <div className="listing-card--flex-between">
                {status && <p className="listing-card__status">{status}</p>}
                {/* <ListingActionItems /> */}
            </div>
            <p className="listing-card__price"><span>{currency}</span>{` \$${price.toLocaleString("en")}`}</p>
        </div>
    </div>
  )
}
