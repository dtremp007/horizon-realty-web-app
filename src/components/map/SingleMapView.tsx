import Map, { MapRef, ViewStateChangeEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SampleListing } from "../../../lib/interfaces/Listings";
import { Marker } from "react-map-gl";
import { GrLocation } from "react-icons/gr";
import { useRef, useState } from "react";
import useSupercluster from "use-supercluster";
import type { BBox } from "geojson";

type Props = {
    coordinates: [number, number];
}

const SingleMapView = ({coordinates}: Props) => {
  const [latitude, longitude] = coordinates;

  return (
    <Map
      initialViewState={{ latitude, longitude, zoom: 15 }}
      style={{ width: "100%", height: "30vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      interactive={false}
    >
      <Marker latitude={latitude} longitude={longitude}>
        <svg
          height={33}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 17.89 23"
        >
          <g>
            <path
              className="map__location-icon"
              d="M8.94,23a38.85,38.85,0,0,1-4.47-4.51C2.43,16.05,0,12.41,0,9A8.95,8.95,0,0,1,10.69.17,8.94,8.94,0,0,1,17.89,9c0,3.46-2.43,7.1-4.48,9.54A38.07,38.07,0,0,1,8.94,23Zm0-17.89a3.86,3.86,0,1,0,2.71,1.13A3.85,3.85,0,0,0,8.94,5.11Z"
            />
          </g>
        </svg>
      </Marker>
    </Map>
  );
};

export default SingleMapView;
