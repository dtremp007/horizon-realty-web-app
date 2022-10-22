import ListingCard from "../components/listing-card/ListingCard";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import {
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import ListingsContext from "../context/listingsContext/listingsContext";
import Spinner from "../shared/Spinner";

/**
 * I was thinking maybe I should wrap the listing view in a component that manages
 * views and so on, but I could probably just do that inside the actual pages.
 * I will try anyway.
 */
export default function ListingsLayout() {
  const { listingsState, dispatch } = useContext(ListingsContext);
  const [listings, setListings] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const router = useRouter();

  const { firebaseDocs, loading } = listingsState;

  useEffect(() => {

    if (router.query) {
      dispatch({
        type: "UPDATE_AND_APPLY_MULTIPLE_FILTER",
        payload: router.query,
      });
    }
  }, [router.query]);

  if (!firebaseDocs) {
    return <h3>No listings to display.</h3>;
  }

  return (
    <div className="listings__container">
      {!loading ? (
        firebaseDocs.map((listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            data={listing.data}
            variant="full"
          />
        ))
      ) : (
        <Spinner />
      )}
    </div>
  );
}
