import CarouselContainer from "../../src/components/carousel/CarouselContainer";
import ListingInfotag from "../../src/components/listing-card/ListingInfotag";
import {
  Divider,
  Space,
  Accordion,
  AccordionItem,
  Group,
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
          {/* <Accordion iconPosition="right">
                <AccordionItem label={<h2>Payments Options</h2>}>
                  <p>1 Payment - $50,000</p>
                  <p>2 Payments - $60,000</p>
                  <p>3 Payments - $70,000</p>
                </AccordionItem>
                <AccordionItem label={<h2>Utilities</h2>}>
                  <ul>
                    <li>Water</li>
                    <li>Power</li>
                    <li>Gas</li>
                  </ul>
                </AccordionItem>
                <AccordionItem label={<h2>Features</h2>}>
                  <ul>
                    <li>Private Residence</li>
                    <li>Lawn</li>
                    <li>Paved Street</li>
                  </ul>
                </AccordionItem>
              </Accordion> */}
          <h2 style={{}}>Ubicación</h2>
          <SingleMapView coordinates={coordinates} />
          <Group mt={18} position="center">
            <a
              href={`http://www.google.com/maps/place/${coordinates[0]},${coordinates[1]}?zoom=14`}
            >
              <Button color="charcoal-gray" leftIcon={googleMapsLogo} size="xl">
                Google Maps
              </Button>
            </a>
          </Group>
          <Divider />
          <p style={{ textAlign: "center" }}>Visitas: N/A</p>
        </div>
      </div>
      <div className="space r4"></div>

      {/* CTA */}
      <div className="detail-page__cta">
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
