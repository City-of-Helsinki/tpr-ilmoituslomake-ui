import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationLocation } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import styles from "./Map.module.scss";

const MapWrapper = dynamic(() => import("./MapWrapper"), { ssr: false });

const Map = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    address: {
      fi: { street: streetFi, post_office: postOfficeFi },
      sv: { street: streetSv, post_office: postOfficeSv },
    },
  } = notification;

  const geocodeAddress = async () => {
    // The Helsinki API does not use postal code
    const input = router.locale === "sv" ? `${streetSv} ${postOfficeSv}` : `${streetFi} ${postOfficeFi}`;
    const language = router.locale === "sv" ? "sv" : "fi";

    const geocodeRequest = await fetch(`https://api.hel.fi/servicemap/v2/search/?format=json&type=address&input=${input}&language=${language}`);
    const geocodeResponse = await geocodeRequest.json();

    console.log("GEOCODE RESPONSE", geocodeResponse);

    if (geocodeResponse.results && geocodeResponse.results.length > 0) {
      // Use the first result
      const { location: resultLocation } = geocodeResponse.results[0];
      console.log(resultLocation.coordinates);

      // Set the location in redux state using the geocoded position
      // Note: this will cause the map to pan to centre on these coordinates
      // The geocoder returns the coordinates as lon,lat but Leaflet needs them as lat,lon
      dispatch(setNotificationLocation([resultLocation.coordinates[1], resultLocation.coordinates[0]]));
    }
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.map.title")}</h2>
      <div className={styles.geocode}>
        <div>{i18n.t("notification.map.notice")}</div>
        <Button variant="secondary" onClick={geocodeAddress}>
          {i18n.t("notification.map.geocode")}
        </Button>
      </div>
      <MapWrapper />
    </div>
  );
};

export default Map;
