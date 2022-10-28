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
import detailedHouseIcon from "../../../public/Icons/detailed-home-icon.svg";
import ranchLandIcon from "../../../public/Icons/farm-land-icon.svg";
import casaBodegaIcon from "../../../public/Icons/casabodega-icon.svg";
import { useRouter } from "next/router";
import Link from "next/link";

type ListingBuffetProps = {
  listingTypeFilter: FilterElement_V2_Props<RadioButtonGroupProps>;
};

const ListingBuffet = ({ listingTypeFilter }: ListingBuffetProps) => {
  const [filter, setFilter] = useState(listingTypeFilter);
  const router = useRouter();

  return (
    <section className="listing-buffet">
      <div className="listing-buffet__grid-layout">
        {filter.filterProps.data.slice(1).map(({ label, value }, index) => (
          <Link
            href={{ pathname: "/listings", query: { listingType: value } }}
            key={value}
          >
            <div className="listing-buffet__card">
              {/* <div className="listing-buffet__background">
                <Image
                  src={listingTypeBackgrounds[index]}
                  layout="fill"
                  objectFit="cover"
                  // objectFit="contain"
                />
              </div> */}
              <Group
                position="center"
                pt={22}
                align="center"
                style={{ height: "100%" }}
              >
                {getIcon(value)}
              </Group>
              <Group
                className="listing-buffet__label"
                position="center"
                pt={10}
                pb={10}
              >
                {/* {getIcon(value)} */}
                {label}
              </Group>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default ListingBuffet;

function getIcon(type: string) {
  switch (type) {
    case "CASA":
      return <Image src={detailedHouseIcon} />;
    case "LOTE":
      return lotIcon;
    case "BODEGA":
      return <Image src={casaBodegaIcon} />;
    case "LOTES_COMERCIALES":
      return <IconBuildingCommunity size={80} />;
    case "LABORES/RANCHOS":
      return <Image src={ranchLandIcon} />;
    default:
      return <IconLayout2 />;
  }
}

const lotIcon = (
  <svg height={70} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.55 24.49">
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
