import ListingActionItems from "./ListingActionItems";
import Image from "next/image";
import houseThumbnail from "../../../public/country-home-unsplash.jpg";
import Show from "../HOC/Show";
import { getToggleFunction } from "../../../lib/util";
import { useState } from "react";

type Props = {
  imageUrl: string;
  backupUrl: string;
  price: number;
  currency: string;
  status: {
    show: boolean;
    content: string;
    color: string;
  };
  availability: "sold" | "available" | "pending";
};

export default function ListingThumbnail({
  imageUrl,
  backupUrl,
  price,
  currency,
  status,
  availability: availibility,
}: Props) {
  const [src, setSrc] = useState(
    process.env.NODE_ENV === "development" ? houseThumbnail : imageUrl
  );
  const toggleSold = getToggleFunction(
    "listing-card--sold",
    availibility === "sold" ? true : false
  );

  return (
    <div className="listing-card__thumbnail">
      <Image
        src={src}
        onError={() => setSrc(backupUrl)}
        layout="fill"
        objectFit="cover"
        alt="thumbnail"
      />
      <div className={toggleSold("listing-card__thumbnail-overlay")}>
        <div className="listing-card--flex-between">
          {status && status.show && <p className="listing-card__status" style={{backgroundColor: status.color}}>{status.content}</p>}
          {/* <ListingActionItems /> */}
        </div>
        <p className="listing-card__price">
          <span>{currency}</span>
          {` \$${price.toLocaleString("en")}`}
        </p>
      </div>
    </div>
  );
}
