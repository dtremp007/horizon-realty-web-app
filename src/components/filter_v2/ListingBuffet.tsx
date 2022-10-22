import { Button, Group } from "@mantine/core";
import { useState } from "react";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import { RadioButtonGroupProps } from "../filter/RadioButtonGroup";
import {
  IconHome,
  IconHome2,
  IconBuildingWarehouse,
  IconLayout2,
  IconBuildingCommunity,
} from "@tabler/icons";
import Image from "next/image";
import houseThumbnail from "../../../public/country-home-unsplash.jpg";
import { useRouter } from "next/router";

type ListingBuffetProps = {
  listingTypeFilter: FilterElement_V2_Props<RadioButtonGroupProps>;
};

const ListingBuffet = ({ listingTypeFilter }: ListingBuffetProps) => {
  const [filter, setFilter] = useState(listingTypeFilter);
  const router = useRouter();

  const handleNavigation = (listingType: string) => {
    router.push({pathname: "/listings", query: {listingType}})
  }

  return (
    <section className="listing-buffet">
      <div className="listing-buffet__grid-layout">
        {filter.filterProps.data.slice(1, 4).map(({ label, value }, index) => (
          <div
            key={value}
            className="listing-buffet__card"
            onClick={() => handleNavigation(value)}
          >
            <div className="listing-buffet__background">
              <Image src={listingTypeBackgrounds[index]} layout="fill" objectFit="cover" />
            </div>
            <Group position="center" mt={18} mb={18} style={{color: "#AA9053"}}>
              {/* <Button variant="outline" color="gold" size="lg" rightIcon={getIcon(value)}>
                {label}
              </Button> */}
              {getIcon(value)}
              {label}
            </Group>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ListingBuffet;

function getIcon(type: string) {
  switch (type) {
    case "CASA":
      return <IconHome/>;
    case "LOTE":
      return lotIcon;
    case "BODEGA":
      return <IconBuildingWarehouse />;
    case "LOTES_COMMERCIALES":
        return <IconBuildingCommunity/>
    default:
      return <IconLayout2 />;
  }
}

const lotIcon = (
  <svg height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.55 24.49">
    <g id="icons">
      <polyline
        className="land-area-1"
        points="19.67 21.5 2.99 21.5 2.99 5.06"
      />
      <polygon
        className="land-area-2"
        points="18.79 18.5 23.97 21.5 18.79 24.49 18.79 18.5"
      />
      <polygon
        className="land-area-2"
        points="5.98 5.93 2.99 0.75 0 5.93 5.98 5.93"
      />
      <line className="land-area-3" x1="5.23" y1="0.75" x2="6.73" y2="0.75" />
      <line className="land-area-4" x1="9.85" y1="0.75" x2="20.74" y2="0.75" />
      <polyline
        className="land-area-3"
        points="22.3 0.75 23.8 0.75 23.8 2.25"
      />
      <line className="land-area-5" x1="23.8" y1="5.37" x2="23.8" y2="16.28" />
      <line className="land-area-3" x1="23.8" y1="17.84" x2="23.8" y2="19.34" />
      <line className="land-area-1" x1="19.99" y1="4.25" x2="6.99" y2="17.71" />
      <line className="land-area-1" x1="12.99" y1="4.25" x2="7.49" y2="9.75" />
      <line
        className="land-area-1"
        x1="19.99"
        y1="12.25"
        x2="14.49"
        y2="17.75"
      />
    </g>
  </svg>
);

const listingTypeBackgrounds = [
    "https://firebasestorage.googleapis.com/v0/b/horizon-real-estate-30201.appspot.com/o/images%2F6D0D76DE-3475-4B13-9137-7657C812505F_1280x720.jpeg?alt=media&token=0c8e322a-77c1-468d-a9b5-d7c291adb39a",
    "https://firebasestorage.googleapis.com/v0/b/horizon-real-estate-30201.appspot.com/o/images%2FIMG_0698_1280x720.jpeg?alt=media&token=08220c2d-e6b2-4557-9d79-3745517c7e43",
    "https://firebasestorage.googleapis.com/v0/b/horizon-real-estate-30201.appspot.com/o/images%2Fphoto31_1280x720.jpeg?alt=media&token=e5b60458-4979-4e5d-a5ff-2e635a2c87f9",
    "https://firebasestorage.googleapis.com/v0/b/horizon-real-estate-30201.appspot.com/o/images%2F2CEF9E40-5597-44FF-8745-9D682CAF4687_1280x720.jpeg?alt=media&token=8cfa3c7a-0e4d-4516-a6f2-70605e988857",
]
