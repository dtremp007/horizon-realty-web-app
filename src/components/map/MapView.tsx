import Map, { MapRef, ViewStateChangeEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SampleListing } from "../../../lib/interfaces/Listings";
import { Marker } from "react-map-gl";
import { GrLocation } from "react-icons/gr";
import { useRef, useState, useContext, useEffect } from "react";
import useSupercluster from "use-supercluster";
import type { BBox } from "geojson";
import ListingsContext from "../../context/listingsContext/listingsContext";

type Props = {
  data: SampleListing[];
};

//TODO: Add constraints to how far out use can zoom using turf. Check out this page https://visgl.github.io/react-map-gl/docs/get-started/state-management
//TODO: Produce a popup, when a listing is pressed. Also, make better icons.

/**
 * Takes in an array of listings.
 *
 * This function takes care of producing a map. Right now, it's full screen,
 * but I'll have to make some changes for desktop. I'm converting the geolocations
 * into GeoJSON Feature objects. This is something I could maybe take care of on the database side.
 *
 * @see https://morioh.com/p/4e3a9a52a0c8 for how I got most of this function.
 */
const MapView = () => {
  const { listingsState, dispatch } = useContext(ListingsContext);
  const { firebaseDocs, mapViewState, scrollToID } = listingsState;

  const mapRef = useRef<MapRef>(null);
  const points = firebaseDocs.map((listing) => {
    const {listingType, coordinates} = listing.data;

    return {
      type: "Feature",
      properties: {
        cluster: false,
        listingId: listing.id,
        category: listingType,
      },
      geometry: {
        type: "Point",
        coordinates: [coordinates[1], coordinates[0]],
      },
    };
  });

  const bounds = mapRef.current
    ? (mapRef.current.getMap().getBounds().toArray().flat() as BBox)
    : undefined;

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: mapViewState.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <Map
    {...mapViewState}
      style={{ width: "100vw", height: "calc(100vh - 60px)" }}
      reuseMaps
      onMove={evt => dispatch({type: "UPDATE_MAP", payload: evt.viewState})}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      ref={mapRef}
      maxZoom={17}
      dragRotate={false}
    >
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;
        const listingId = cluster.properties.listingId;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={latitude}
              longitude={longitude}
            >
              <div
                className="map-view__cluster-marker"
                style={{
                  width: `${10 + (pointCount / points.length) * 20}px`,
                  height: `${10 + (pointCount / points.length) * 20}px`,
                }}
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );

                  mapRef.current?.easeTo({
                    center: [longitude, latitude],
                    zoom: expansionZoom,
                  });
                }}
              >
                {pointCount}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            key={`listing-${listingId}`}
            latitude={latitude}
            longitude={longitude}
            onClick={() => dispatch({type: "UPDATE_SCROLL_POSITION", payload: listingId})}
          >
            <svg
              height={33}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 17.89 23"
              className={`${scrollToID === listingId ? "map__location-icon--selected" : ""}`}
            >
              <g>
                <path
                  className={`map__location-icon`}
                  d="M8.94,23a38.85,38.85,0,0,1-4.47-4.51C2.43,16.05,0,12.41,0,9A8.95,8.95,0,0,1,10.69.17,8.94,8.94,0,0,1,17.89,9c0,3.46-2.43,7.1-4.48,9.54A38.07,38.07,0,0,1,8.94,23Zm0-17.89a3.86,3.86,0,1,0,2.71,1.13A3.85,3.85,0,0,0,8.94,5.11Z"
                />
              </g>
            </svg>
          </Marker>
        );
      })}
    </Map>
  );
};
export default MapView;
