import { NextPage, GetStaticProps} from "next";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapView from "../src/components/map/MapView";
import path from "path";
import { readFile } from "fs/promises";
import { SampleListing } from "../lib/interfaces/Listings";

type Props = {
    data: {
        listings: SampleListing[]
    }
}

const MapPage: NextPage<Props> = ({data}) => {
  return (
    <>
    <MapView data={data.listings} />
    {/* <div className="map-page_overlay">
        <MapListingsOverlay />
    </div> */}
    </>
  );
};
export default MapPage;

export const getStaticProps = async () => {
    const filePath = path.join(process.cwd(), "lib", "data.json");
    const response = await readFile(filePath, "utf8");
    return {
        props: {
            data: JSON.parse(response)
        }
    }
}
