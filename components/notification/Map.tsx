import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { Button, IconPlaybackNext } from "hds-react";
import { LatLngExpression } from "leaflet";
import { setMapView, setNotificationLocation } from "../../state/actions/notification";
import { NotificationAction } from "../../state/actions/types";
import { RootState } from "../../state/reducers";
import { getNeighborhood } from "../../utils/address";
import styles from "./Map.module.scss";

const MapWrapper = dynamic(() => import("../common/MapWrapper"), { ssr: false });

const Map = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const mapCenter = useSelector((state: RootState) => state.notification.center);
  const initialZoom = useSelector((state: RootState) => state.notification.zoom);
  const { location } = useSelector((state: RootState) => state.notification.notification);

  const updateLocation = (coordinates: [number, number]) => {
    dispatch(setNotificationLocation(coordinates));
    getNeighborhood(coordinates[1], coordinates[0], dispatch);
  };

  const updateMapView = (center: LatLngExpression, zoom: number) => {
    dispatch(setMapView(center, zoom));
  };

  const skipMap = () => {
    window.location.href = "#contact";
  };

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.map.title")}</h3>
      <Button variant="supplementary" size="small" className="visibleOnFocusOnly" iconRight={<IconPlaybackNext aria-hidden />} onClick={skipMap}>
        {i18n.t("notification.map.skipMap")}
      </Button>

      <div className={styles.geocode}>
        <div>{i18n.t("notification.map.notice")}</div>
      </div>
      <MapWrapper
        className={styles.map}
        initialCenter={mapCenter as [number, number]}
        initialZoom={initialZoom}
        location={location}
        setLocation={updateLocation}
        setMapView={updateMapView}
        draggableMarker
      />
    </div>
  );
};

export default Map;
