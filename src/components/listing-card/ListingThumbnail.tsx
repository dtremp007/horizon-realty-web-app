import ListingActionItems from "./ListingActionItems"
import Image from "next/image";
import houseThumbnail from "../../../public/todd-kent-178j8tJrNlc-unsplash.jpg"

export default function ListingThumbnail() {
  return (
    <div className="listing-card__thumbnail">
       <Image src={houseThumbnail} layout="fill" objectFit="cover" />
        <div className="listing-card__thumbnail-overlay">
            <div className="listing-card--flex-between">
                <p className="listing-card__status">Popular</p>
                <ListingActionItems />
            </div>
            <p className="listing-card__price">USD 300,000</p>
        </div>
    </div>
  )
}
