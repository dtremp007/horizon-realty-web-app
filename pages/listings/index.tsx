import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import FilterMenu from "../../src/components/filter/FilterMenu";
import ListingsLayout from "../../src/layouts/ListingsLayout";
import { useMediaQuery } from "@mantine/hooks";
import { getDocs, collection, where } from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import ListingsContext, {
  ListingsProvider,
} from "../../src/context/listingsContext/listingsContext";
import Router, { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { ListingSchema } from "../../lib/interfaces/Listings";
import path from "path";
import { readFileSync } from "fs";
import { FilterElement_V2_Props } from "../../lib/interfaces/FilterTypes";
import AuthUserContext from "../../src/context/authUserContext";
import { getToggleFunction } from "../../lib/util";
import { NavContext } from "../../src/layouts/AltMainLayout";
import { navTracker } from "../_app";

const MapView = dynamic(() => import("../../src/components/map/MapView"));
const MapListingsOverlay = dynamic(
  () => import("../../src/components/map/MapListingsOverlay")
);

type Props = {
  firebaseDocs: {
    id: string;
    data: ListingSchema;
  }[];
  filters: FilterElement_V2_Props[];
};


const Listings: NextPage<Props> = ({ firebaseDocs, filters }) => {
  const isDesktop = useMediaQuery("(min-width: 695px)", true);
  const router = useRouter();
  const [view, setView] = useState(router.query.view);
  const { user } = useContext(AuthUserContext);
  const { nav_state, dispatch_to_nav } = useContext(NavContext);

  const shouldShowFilter = true;

  useEffect(() => {
    navTracker.userWasHere();
  }, [])

  useEffect(() => {
    if (router.query.view === "map") {

    }
    setView(router.query.view);
  }, [router.query.view]);

  return (
    <ListingsProvider firebaseDocs={firebaseDocs} filters={filters}>
      {view === "map" ? (
        <>
          <MapListingsOverlay />
          <MapView />
        </>
      ) : (
        <div className="listing-page__layout">
          {shouldShowFilter && <FilterMenu />}
          <ListingsLayout />
        </div>
      )}
    </ListingsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const fileName = path.join(process.cwd(), "lib", "filters.json");
  const filtersFile = readFileSync(fileName, { encoding: "utf8" });

  const querySnapshot = await getDocs(collection(db, "listings"));
  const firebaseDocs = querySnapshot.docs.map((listing) => ({
    id: listing.id,
    data: listing.data(),
  }));
  const filterQuerySnapshot = await getDocs(collection(db, "filters"));
  const filters = filterQuerySnapshot.docs.map((filter) => {
    return filter.data();
  });

  return {
    props: {
      firebaseDocs,
      filters:
        process.env.NODE_ENV === "development"
          ? JSON.parse(filtersFile).filters
          : filters,
    },
  };
};

export default Listings;
