import ListingActionItems from "./ListingActionItems"
import Image from "next/image";
import houseThumbnail from "../../../public/todd-kent-178j8tJrNlc-unsplash.jpg"

type Props = {
    imageUrl: string;
    price: number;
    currency: string;
}

export default function ListingThumbnail({imageUrl, price, currency}: Props) {
  return (
    <div className="listing-card__thumbnail">
       <Image src={imageUrl} layout="fill" objectFit="cover" />
        <div className="listing-card__thumbnail-overlay">
            <div className="listing-card--flex-between">
                <p className="listing-card__status">Popular</p>
                <ListingActionItems />
            </div>
            <p className="listing-card__price">{`${currency} \$${price.toLocaleString("en")}`}</p>
        </div>
    </div>
  )
}
