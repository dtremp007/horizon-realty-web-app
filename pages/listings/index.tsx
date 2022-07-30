import { NextPage } from "next"
import FilterMenu from "../../src/components/filter/FilterMenu"
import ListingsLayout from "../../src/layouts/ListingsLayout"
import { useMediaQuery } from "@mantine/hooks"

const Listings: NextPage = () => {
    const isDesktop = useMediaQuery("(min-width: 695px)", true);

  return (
    <div className="listing-page__layout">
        {isDesktop && <FilterMenu />}
        <ListingsLayout />
    </div>
  )
}
export default Listings
