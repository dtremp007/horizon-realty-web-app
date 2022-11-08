import CarouselContainer from "../../src/components/carousel/CarouselContainer";
import ListingInfotag from "../../src/components/listing-card/ListingInfotag";
import {
  Divider,
  Space,
  Accordion,
 Flex,
  Button,
  ActionIcon,
} from "@mantine/core";
import ListingLocation from "../../src/components/listing-card/ListingLocation";
import SingleMapView from "../../src/components/map/SingleMapView";
import PriceDisplay from "../shared/PriceDisplay";
import InfoTagWrapper from "../components/listing-card/InfoTagWrapper";
import { googleMapsLogo } from "./ListingDesktopLayout";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getToggleFunction } from "../../lib/util";

type Props = {
  data: any;
};

const ListingDetailLayout = ({ data }: Props) => {
  const {
    title,
    price,
    currency,
    coordinates,
    address,
    imageUrls,
    landArea,
    landAreaUnits,
    description,
    paymentType,
  } = data;

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const timeoutId = useRef<any>();

  const handleScroll = (e?: Event) => {
    if (typeof window !== "undefined") {
      clearTimeout(timeoutId.current);

      if (window.scrollY > document.body.scrollHeight - window.innerHeight)
        return;

      if (window.scrollY < lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);

      timeoutId.current = setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  };

  const toggleCTA = getToggleFunction("hide", !show);

  useEffect(() => {
    handleScroll();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY]);

  return (
    <>
      <div className="detail-page__container">
        <CarouselContainer images={imageUrls} title={title} />
        <div className="detail-page__main-content flow-content">
          <div className="flow-content">
            <div className="detail-page__price-wrapper">
              <PriceDisplay price={price} currency={currency} />
              <p>{paymentType}</p>
            </div>
            <ListingLocation address={address} />
            <InfoTagWrapper {...data} />
          </div>
          <div className=" flow-content">
            <h2 className="detail-page__title">{title}</h2>
            <div
              className="desktop-page__description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          {(coordinates && coordinates.length > 0) ? (
            <>
              <h2 style={{}}>Ubicación</h2>
              <SingleMapView coordinates={coordinates} />
              <Flex mt={18} justify="center">
                <a
                  href={`http://www.google.com/maps/place/${coordinates[0]},${coordinates[1]}?zoom=14`}
                >
                  <Button
                    color="charcoal-gray"
                    leftIcon={googleMapsLogo}
                    size="xl"
                  >
                    Google Maps
                  </Button>
                </a>
              </Flex>
            </>
          ) : null}
          <Divider />
          <p style={{ textAlign: "center" }}>Visitas: N/A</p>
        </div>
      </div>
      <div className="space r4"></div>

      {/* CTA */}
      <div className={toggleCTA("detail-page__cta")}>
        <ActionIcon
          size="lg"
          onClick={() =>
            window.open(
              `mailto:info@horizonrealty.mx?subject=${encodeURIComponent(
                data.title
              )}&body=${encodeURIComponent(
                "Hola, estoy escribiendo sobre " + data.title
              )}`
            )
          }
        >
          <AiOutlineMail size={35} />
        </ActionIcon>
        <ActionIcon
          size="lg"
          onClick={() =>
            window.open(
              `https://wa.me/526251459646?text=${encodeURIComponent(
                "Hola, estoy escribiendo sobre " + data.title
              )}`,
              "_blank"
            )
          }
        >
          <FaWhatsapp size={32} />
        </ActionIcon>
      </div>
    </>
  );
};
export default ListingDetailLayout;
