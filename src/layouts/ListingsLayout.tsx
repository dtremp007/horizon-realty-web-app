import ListingCard from "../components/listing-card/ListingCard";
import { useRouter } from "next/router";
import NavigationContext from "../context/navigationContext";
import { useContext } from "react";

/**
 * I was thinking maybe I should wrap the listing view in a component that manages
 * views and so on, but I could probably just do that inside the actual pages.
 * I will try anyway.
 */
export default function ListingsLayout() {
    const {state, dispatch} = useContext(NavigationContext)
    const router = useRouter();

    const handleClick = () => {
        router.push("/listings/1")
        dispatch({type: "TOGGLE_BACK_BUTTON"})
    }

  return (
    <div className="listings__container">
        {[1,2,3,4,5,6].map(e => (
            <ListingCard key={e} variant="full" onClick={() => router.push("/listings/1")}/>
        ))}
    </div>
  )
}
