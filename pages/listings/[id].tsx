import { NextPage } from "next";
import CarouselContainer from "../../src/components/carousel/CarouselContainer";
import ListingInfotag from "../../src/components/listing-card/ListingInfotag";
import { Divider, Space, Accordion, AccordionItem } from "@mantine/core";
import img1 from "../../public/Images/image-1.jpeg";
import img2 from "../../public/Images/image-2.jpeg";
import img3 from "../../public/Images/image-3.jpeg";
import ListingLocation from "../../src/components/listing-card/ListingLocation";
import SingleMapView from "../../src/components/map/SingleMapView";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import Show from "../../src/components/HOC/Show";
import { useContext, useEffect } from "react";
import NavigationContext from "../../src/context/navigationContext";

const DetailedPage: NextPage = () => {
    const {state, dispatch} = useContext(NavigationContext)

    useEffect(() => {
        return () => {
            dispatch({type: "TOGGLE_BACK_BUTTON"})
        }
    }, [])

  return (
    <>
      <div>
        <CarouselContainer images={[img1, img2, img3]} />
        <div className="detail-page__main-content flow-content">
          <h2 className="detail-page__price">USD $50,000</h2>
          <ListingLocation />
            <div className="listing-card__info-tag-wrapper">
              <ListingInfotag quantity={1.5} variant="land" />
            </div>
          <Divider />
          <h2 className="detail-page__title">
            Building Lot Fraccionamiento Harms
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
            commodi rem pariatur quis reprehenderit, optio doloremque facere
            atque placeat culpa similique est dolore ipsa impedit. Repellendus
            ipsam quaerat beatae itaque quidem consectetur, perferendis eius?
            Laudantium odio animi vitae earum distinctio quas, quae perferendis
            magnam totam labore debitis nesciunt dignissimos asperiores. Ipsam,
            distinctio vitae vero placeat odio cum officia accusamus
            consequuntur quod. Velit perferendis ratione fugiat alias recusandae
            deserunt nisi error provident repellat, dolore minus ab, deleniti
            aliquam ea architecto dolor obcaecati a sint commodi rerum, tempora
            voluptatibus quae eligendi! Nulla, facilis laudantium dolor omnis
            animi nobis exercitationem deleniti fugit eius!
          </p>
          <Accordion iconPosition="right">
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
          </Accordion>
          <h2 style={{}}>Location</h2>
          <SingleMapView />
          <div className="detail-page__map-link">
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
            <a href="https://goo.gl/maps/beezSkBxrSUrTcWN9">Google Maps</a>
          </div>
          <Divider />
          <p style={{ textAlign: "center" }}>Visits: 123</p>
        </div>
      </div>
      <div className="space r4"></div>
      <div className="detail-page__cta">
        <AiOutlineMail size={35} />
        <FaWhatsapp size={32} />
      </div>
    </>
  );
};
export default DetailedPage;
