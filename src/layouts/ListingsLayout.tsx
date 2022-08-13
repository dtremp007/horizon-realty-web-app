import ListingCard from "../components/listing-card/ListingCard";
import { useRouter } from "next/router";
import NavigationContext from "../context/navigationContext";
import { useContext, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import {QuerySnapshot, DocumentData, QueryDocumentSnapshot} from "firebase/firestore"
import ListingsContext from "../context/listingsContext/listingsContext";
import Spinner from "../shared/Spinner";

/**
 * I was thinking maybe I should wrap the listing view in a component that manages
 * views and so on, but I could probably just do that inside the actual pages.
 * I will try anyway.
 */
export default function ListingsLayout() {
    const {state, dispatch} = useContext(NavigationContext)
    const {listingsState} = useContext(ListingsContext)
    const [listings, setListings] = useState<QueryDocumentSnapshot<DocumentData>[]>([])
    const router = useRouter();

    const {firebaseDocs, loading} = listingsState;

    const handleClick = (id: string) => {
        router.push(`/listings/${id}`)
        dispatch({type: "BACK_BTN_ON"})
  }

    if (!firebaseDocs) {
        return <h3>No listings to display.</h3>
    }

  return (
    <div className="listings__container">
        {!loading ? firebaseDocs.map(listing => (
            <ListingCard key={listing.id} data={listing.data} variant="full" onClick={() => handleClick(listing.id)}/>
        )) : <Spinner/>}
    </div>
  )
}
