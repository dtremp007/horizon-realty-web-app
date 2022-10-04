import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPage,
} from "next";
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
