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
import { ListingSchema } from "../../lib/interfaces/Listings";

const BASEPOINT: Point = [28.474188510761923, -106.91194010234048];

/**
 * I was thinking maybe I should wrap the listing view in a component that manages
 * views and so on, but I could probably just do that inside the actual pages.
 * I will try anyway.
 */
export default function ListingsLayout() {
  const { listingsState, dispatch } = useContext(ListingsContext);
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
        firebaseDocs
          .filter((listing) => listing.data.imageUrls.length > 0)
          .sort(
            (a, b) =>
              distanceFromBasePoint(a.data.coordinates) -
              distanceFromBasePoint(b.data.coordinates)
          )
          .map((listing) => (
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

type Point = [number, number];

function distanceBtwnPoints([p1, p2]: Point, [y1, y2]: Point) {
  return Math.sqrt(
    Math.abs(Math.pow(y2 - y1, 2)) + Math.abs(Math.pow(p2 - p1, 2))
  );
}

export function distanceFromBasePoint(point: Point) {
  return distanceBtwnPoints(BASEPOINT, point);
}
