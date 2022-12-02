import { Button,Flex } from "@mantine/core";
import { useEffect, useState } from "react";
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
import apartmentIcon from "../../../public/Icons/apartments-icon.svg";
import { useRouter } from "next/router";
import Link from "next/link";
import Spinner from "../../shared/Spinner";
import {MdAttachMoney} from "react-icons/md"

type ListingBuffetProps = {
  listingTypeFilter: FilterElement_V2_Props<RadioButtonGroupProps>;
};

const ListingBuffet = ({ listingTypeFilter }: ListingBuffetProps) => {
  const [filter, setFilter] = useState(listingTypeFilter);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
      <div className="listing-buffet__grid-layout">
        {filter.filterProps.data.map((values, index) => (
          <ListingBuffetCard key={index} {...values} />
        ))}
      </div>
  );
};
export default ListingBuffet;

type ListingBuffetCardProps = {
  value: string;
  label: string;
};

const ListingBuffetCard = ({ label, value }: ListingBuffetCardProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleLoadingState = (route: string) => {
      const re = /\?.*/;
      const url = new URLSearchParams(route.match(re)?.at(0));

      if (url.get("listingType") === value) {
        setLoading(true);
      }
    };
    router.events.on("routeChangeStart", handleLoadingState);

    return () => router.events.off("routeChangeStart", handleLoadingState);
  }, []);

  return (
    <Link
      href={{ pathname: "/listings", query: { listingType: value } }}
      key={value}
    >
      <div className="listing-buffet__card">
        <Flex
          justify="center"
          pt={22}
          align="center"
          style={{ height: "100%" }}
        >
          {loading ? <Spinner /> : getIcon(value)}
        </Flex>
        <Flex
          className="listing-buffet__label"
          justify="center"
          pt={10}
          pb={10}
        >
          {label}
        </Flex>
      </div>
    </Link>
  );
};

function getIcon(type: string) {
  switch (type) {
    case "CASA":
      return <Image src={detailedHouseIcon} />;
    case "LOTES_RESIDENCIALES":
    case "LOTE":
      return lotIcon;
    case "BODEGA":
      return <Image src={casaBodegaIcon} />;
    case "LOTES_COMERCIALES":
      return <IconBuildingCommunity size={80} />;
    case "LABORES/RANCHOS":
      return <Image src={ranchLandIcon} />;
    case "APARTMENTS":
      return <Image src={apartmentIcon} />;
    case "VENDIDO":
        return <MdAttachMoney size={80}/>
    default:
      return <IconLayout2 size={80}/>;
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
