import { GetServerSideProps, NextPage } from "next";
import FilterMenu from "../../src/components/filter/FilterMenu";
import ListingsLayout from "../../src/layouts/ListingsLayout";
import { useMediaQuery } from "@mantine/hooks";
import { getDocs, collection, where } from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import { QuerySnapshot, DocumentData } from "firebase/firestore";
import { ListingsProvider } from "../../src/context/listingsContext/listingsContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import MapView from "../../src/components/map/MapView";

type Props = {
  firebaseDocs: {
    id: string;
    data: DocumentData;
  }[];
};

/*
    TODO:
    - Renable filter
*/

const Listings: NextPage<Props> = ({ firebaseDocs }) => {
  const isDesktop = useMediaQuery("(min-width: 695px)", true);
  const router = useRouter();
  const [view, setView] = useState(router.query.view);

  useEffect(() => {
    setView(router.query.view)
  }, [router.query.view])

  return (
    <ListingsProvider firebaseDocs={firebaseDocs}>
      {view === "map" ? (
        <MapView />
      ) : (
        <div className="listing-page__layout">
          {/*isDesktop && <FilterMenu />*/}
          <ListingsLayout />
        </div>
      )}
    </ListingsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const querySnapshot = await getDocs(collection(db, "listings"));
  const firebaseDocs = querySnapshot.docs.map((listing) => ({
    id: listing.id,
    data: listing.data(),
  }));

  return {
    props: {
      firebaseDocs,
    },
  };
};

export default Listings;
