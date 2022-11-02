import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import ListingInfotag from "../listing-card/ListingInfotag";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import house from "../../../public/country-home-unsplash.jpg"

type Props = {
  data: DocumentData;
  id: string;
};

const ListingCardAlt = ({ data, id }: Props) => {
  const { title, imageUrls, price, landArea, currency } = data;
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState(() => {
      const regexp = /(\.[^.]*?\?)/
      return imageUrls[0].replace(regexp, "_1280x720.jpeg?")
  })


  return (
    <div className="listing-cardv2">
      <div className="listing-card__thumbnailv2">
        <Image
          src={thumbnail}
          alt="thumbnail"
          onError={() => setThumbnail(imageUrls[0])}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="listing-card__info-displayv2">
        <p>{title}</p>
        <Button onClick={() => router.push(`/listings/${id}`)}>Ver detalles</Button>
      </div>
      <p className="listing-card__pricev2">{`${currency} \$${price.toLocaleString("en")}`}</p>
    </div>
  );
};
export default ListingCardAlt;
