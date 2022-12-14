import CarouselContainer from "../components/carousel/CarouselContainer";
import ListingInfotag from "../components/listing-card/ListingInfotag";
import {
  Divider,
  Space,
  Accordion,
  Image,
  Button,
  ActionIcon,
 Flex,
} from "@mantine/core";
import ListingLocation from "../components/listing-card/ListingLocation";
import SingleMapView from "../components/map/SingleMapView";
import PriceDisplay from "../shared/PriceDisplay";
import InfoTagWrapper from "../components/listing-card/InfoTagWrapper";
import { useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import BackButton from "../components/navigation/BackButton";
import { useRouter } from "next/router";
import { navTracker } from "../../pages/_app";
import { ListingSchema } from "../../lib/interfaces/Listings";

type Props = {
  data: ListingSchema;
};

const ListingDesktopLayout = ({ data }: Props) => {
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
    listingType
  } = data;
  const router = useRouter();

  const enhancedUrls = useMemo(() => {
    return imageUrls.map((url: string, index: number, arr: any) => {
      let className = "";

      if (index === 0) {
        className = "full";
      }

      if (index === arr.length - 1 && index % 2 === 1) {
        className = "last";
      }

      const regexp = /(\.[^.]*?\?)/;
      const enhancedUrl =
        process.env.NODE_ENV !== "development"
          ? url.replace(regexp, "_1280x720.jpeg?")
          : url;

      return {
        url: enhancedUrl,
        className,
      };
    });
  }, []);

  return (
    <>
      <div className="desktop-page__bbtn">
        <BackButton onClick={(router) => {
            if (navTracker.userMadePitstop()) {
                router.back()
            } else {
                router.push({
                    pathname: "/listings",
                    query: {
                        listingType
                    }
                })
            }
        }}/>
      </div>
      <div className="desktop-page__container">
        <div className="wrap-the-wrapper">
          <div className="grid-wrapper">
            <div className="desktop-page__mosaic">
              {enhancedUrls.map(
                (image: { url: string; className: string }, index: number) => (
                  <div className={image.className}>
                    <Image key={index} src={image.url} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="wrap-the-wrapper">
          <div className="grid-wrapper">
            <div className="desktop-page__main-content flow-content">
              <div className="desktop-page__cta">
                <Button
                  leftIcon={<FaWhatsapp size={30} />}
                  size="md"
                  fullWidth
                  // gradient={{from: "#313134", to: "#141517", deg: 180}}
                  // variant="filled"
                  color="charcoal-gray"
                  onClick={() =>
                    window.open(
                      `https://wa.me/526251459646?text=${encodeURIComponent(
                        "Hola, estoy escribiendo sobre " + data.title
                      )}`,
                      "_blank"
                    )
                  }
                >
                  Pregunta por este listado
                </Button>
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
              </div>

              <div className="detail-page--card flow-content">
                <div className="desktop-page__price-wrapper">
                  <PriceDisplay price={price} currency={currency} />
                  <p>{paymentType}</p>
                </div>
                <ListingLocation address={address} />
                <InfoTagWrapper {...data} />
              </div>
              <div className="detail-page--card flow-content">
                <h2 className="desktop-page__title">{title}</h2>
                <div
                  className="desktop-page__description"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
              {(coordinates && coordinates.length > 0) ? (
                <>
                  <h2 style={{}}>Ubicaci??n</h2>
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
        </div>
      </div>
      {/* <div className="space r3"></div> */}
    </>
  );
};
export default ListingDesktopLayout;

export const googleMapsLogo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    style={{ fill: "#00000" }}
  >
    <path
      fill="#48b564"
      d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"
    ></path>
    <path
      fill="#fcc60e"
      d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"
    ></path>
    <path
      fill="#2c85eb"
      d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"
    ></path>
    <path
      fill="#ed5748"
      d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"
    ></path>
    <path
      fill="#5695f6"
      d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"
    ></path>
  </svg>
);
