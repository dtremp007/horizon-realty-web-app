import ListingActionItems from "./ListingActionItems"
import Image from "next/image";
import houseThumbnail from "../../../public/todd-kent-178j8tJrNlc-unsplash.jpg"
import Show from "../HOC/Show"

type Props = {
    imageUrl: string;
    price: number;
    currency: string;
    status: string;
}

export default function ListingThumbnail({imageUrl, price, currency, status}: Props) {
  return (
    <div className="listing-card__thumbnail">
       <Image src={imageUrl} layout="fill" objectFit="cover" alt="thumbnail"/>
        <div className="listing-card__thumbnail-overlay">
            <div className="listing-card--flex-between">
                {status && <p className="listing-card__status">{status}</p>}
                {/* <ListingActionItems /> */}
            </div>
            <p className="listing-card__price"><span>{currency}</span>{` \$${price.toLocaleString("en")}`}</p>
        </div>
    </div>
  )
}
