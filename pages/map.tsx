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

const MapPage: NextPage<Props> = () => {
  return (
    <>
    <MapView />
    {/* <div className="map-page_overlay">
        <MapListingsOverlay />
    </div> */}
    </>
  );
};
export default MapPage;
