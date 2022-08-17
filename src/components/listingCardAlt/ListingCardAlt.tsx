import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import ListingInfotag from "../listing-card/ListingInfotag";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";

type Props = {
  data: DocumentData;
  id: string;
};

const ListingCardAlt = ({ data, id }: Props) => {
  const { title, imageUrls, price, landArea, currency } = data;
  const router = useRouter();

  return (
    <div className="listing-cardv2">
      <div className="listing-card__thumbnailv2">
        <Image
          src={imageUrls[0]}
          alt="thumbnail"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="listing-card__info-displayv2">
        <p>{title}</p>
        <Button onClick={() => router.push(`/listings/${id}`)}>See Details</Button>
      </div>
      <p className="listing-card__pricev2">{`${currency} \$${price.toLocaleString("en")}`}</p>
    </div>
  );
};
export default ListingCardAlt;
