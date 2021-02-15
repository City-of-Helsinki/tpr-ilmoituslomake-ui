import React, { ReactElement, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { Marker as LeafletMarker, Icon, LatLngExpression } from "leaflet";
import { MAP_TILES_URL, MAP_MIN_ZOOM, MAP_MAX_ZOOM } from "../../types/constants";
import getOrigin from "../../utils/request";

interface MapWrapperProps {
  className?: string;
  initialCenter: [number, number];
  initialZoom: number;
  location: [number, number];
  setLocation?: (location: [number, number]) => void;
  setMapView?: (center: LatLngExpression, zoom: number) => void;
  setMapReady?: (ready: boolean) => void;
  draggableMarker: boolean;
}

const MapWrapper = ({
  className,
  initialCenter,
  initialZoom,
  location,
  setLocation,
  setMapView,
  setMapReady,
  draggableMarker,
}: MapWrapperProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const markerRef = useRef<LeafletMarker>(null);

  // Use the icon images from the public folder
  const icon = new Icon.Default({ imagePath: `${getOrigin(router)}/` });

  // Helper function
  const isLocationValid = () => location && location.length === 2 && location[0] > 0 && location[1] > 0;

  // Center on the marker if possible
  const center = isLocationValid() ? location : initialCenter;

  // Set the location in redux state after the marker is dragged to a new position
  // Note: this will cause the map to pan to centre on these coordinates
  const markerEventHandlers = {
    dragend: () => {
      const marker = markerRef.current;
      if (marker && setLocation) {
        setLocation([marker.getLatLng().lat, marker.getLatLng().lng]);
      }
    },
  };

  // Use a ref to store the previous location, as described in the React hooks docs
  const usePrevious = (value: [number, number]) => {
    const ref = useRef<[number, number]>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const prevLocation = usePrevious(location);

  // A child component must be used in order to access the react-leaflet map hook
  const CustomMapHandler = () => {
    const map = useMap();

    // Force a map update otherwise the map does not always render correctly after a page is first loaded
    map.invalidateSize();

    // If the location in redux state has changed, by geocoding or dragging, pan the map to centre on the new position
    useEffect(() => {
      if (isLocationValid() && prevLocation !== location) {
        map.panTo(location);
      }
    }, [map]);

    // Store the map view in redux state, so that the same zoom can be used when changing pages
    // The map centre is stored if needed, but currently the map is always centred on the marker position
    useMapEvents({
      moveend: () => {
        if (setMapView) {
          setMapView(map.getCenter(), map.getZoom());
        }
      },
    });

    // Nothing to render for this
    return null;
  };

  const whenReady = () => {
    if (setMapReady) {
      setMapReady(true);
    }
  };

  return (
    <MapContainer className={className} center={center} zoom={initialZoom} minZoom={MAP_MIN_ZOOM} maxZoom={MAP_MAX_ZOOM} whenReady={whenReady}>
      <CustomMapHandler />
      <TileLayer
        url={MAP_TILES_URL}
        attribution={`<a href="https://www.openstreetmap.org/copyright" target="_blank">© ${i18n.t("common.map.osm")}</a>`}
      />
      {isLocationValid() && (
        <Marker ref={markerRef} icon={icon} position={location} draggable={draggableMarker} eventHandlers={markerEventHandlers} />
      )}
    </MapContainer>
  );
};

MapWrapper.defaultProps = {
  className: "",
  setLocation: undefined,
  setMapView: undefined,
  setMapReady: undefined,
};

export default MapWrapper;
