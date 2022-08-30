import { GetServerSideProps, NextPage } from "next";
import FilterMenu from "../../src/components/filter/FilterMenu";
import ListingsLayout from "../../src/layouts/ListingsLayout";
import { useMediaQuery } from "@mantine/hooks";
import { getDocs, collection, where } from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import { QuerySnapshot, DocumentData } from "firebase/firestore";
import { ListingsProvider } from "../../src/context/listingsContext/listingsContext";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import MapView from "../../src/components/map/MapView";
import MapListingsOverlay from "../../src/components/map/MapListingsOverlay";

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
  console.log(firebaseDocs)
  const [view, setView] = useState(router.query.view);

  useEffect(() => {
    setView(router.query.view);
  }, [router.query.view]);

  return (
    <ListingsProvider firebaseDocs={firebaseDocs}>
      {view === "map" ? (
        <>
          <MapListingsOverlay />
          <MapView />
        </>
      ) : (
        <ListingsLayout />
        //   isDesktop && <FilterMenu />
        // <div className="listing-page__layout">
        //   <ListingsLayout />
        // </div>
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
//   const fileName = path.join(__dirname, "..","..","..","lib", "data.json");
//   console.log(fileName)
//   const data = readFileSync(fileName, { encoding: "utf8" });
//   const docs = JSON.parse(data).docs;

  return {
    props: {
      firebaseDocs,
    // firebaseDocs: docs
    },
  };
};

export default Listings;
