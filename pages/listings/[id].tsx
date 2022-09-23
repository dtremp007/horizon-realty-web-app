import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { useContext, useEffect } from "react";
import ListingsContext from "../../src/context/listingsContext/listingsContext";
import { useRouter } from "next/router";
import {
  doc,
  DocumentData,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import ListingDetailLayout from "../../src/layouts/ListingDetailLayout";
import { ActionIcon } from "@mantine/core";
import { ParsedUrlQuery } from "querystring";
import { useMediaQuery } from "@mantine/hooks";
import ListingDesktopLayout from "../../src/layouts/ListingDesktopLayout";

type Props = {
  data: DocumentData;
};

const DetailedPage: NextPage<Props> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 695px)", false);

  return (
    <>
      <div className="noise" />
      {isDesktop ? (
        <ListingDesktopLayout data={data} />
      ) : (
        <ListingDetailLayout data={data} />
      )}
      {isDesktop ? null : (
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
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = (context.params as ParsedUrlQuery).id as string;
  const docRef = doc(db, "listings", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return {
    props: {
      data,
    },
  };
};

export default DetailedPage;
