import ListingCard from "../components/listing-card/ListingCard";

/**
 * I was thinking maybe I should wrap the listing view in a component that manages
 * views and so on, but I could probably just do that inside the actual pages.
 * I will try anyway.
 */
export default function ListingsLayout() {
  return (
    <div className="listings__container">
        {[1,2,3,4,5,6].map(e => (
            <ListingCard key={e} variant="full"/>
        ))}
    </div>
  )
}
