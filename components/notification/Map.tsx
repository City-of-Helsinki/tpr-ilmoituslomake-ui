import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { Button, IconPlaybackNext } from "hds-react";
import { LatLngExpression } from "leaflet";
import { setMapView, setNotificationLocation } from "../../state/actions/notification";
import { NotificationAction } from "../../state/actions/types";
import { RootState } from "../../state/reducers";
import { getNeighborhood, searchAddress } from "../../utils/address";
import styles from "./Map.module.scss";

const MapWrapper = dynamic(() => import("../common/MapWrapper"), { ssr: false });

const Map = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const mapCenter = useSelector((state: RootState) => state.notification.center);
  const mapZoom = useSelector((state: RootState) => state.notification.zoom);

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    address: {
      fi: { street: streetFi, post_office: postOfficeFi },
      sv: { street: streetSv, post_office: postOfficeSv },
    },
    location,
  } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { locationOriginal } = notificationExtra;

  const isLocationChanged = () => {
    return (
      location &&
      locationOriginal &&
      location.length === 2 &&
      locationOriginal.length === 2 &&
      location[0] > 0 &&
      location[1] > 0 &&
      location[0] !== locationOriginal[0] &&
      location[1] !== locationOriginal[1]
    );
  };

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
        initialZoom={mapZoom}
        location={location}
        setLocation={updateLocation}
        setMapView={updateMapView}
        draggableMarker
      />

      <Button
        className={styles.resetLocation}
        variant="secondary"
        onClick={() => searchAddress(router.locale, streetFi, postOfficeFi, streetSv, postOfficeSv, dispatch)}
        disabled={!isLocationChanged()}
      >
        {i18n.t("notification.map.resetLocation")}
      </Button>
    </div>
  );
};

export default Map;
