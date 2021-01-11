import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationPlaceResults, setNotificationPlaceSearch } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { NotificationPlaceResult } from "../../types/general";
import styles from "./PlaceSearch.module.scss";

const PlaceSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const placeSearch = useSelector((state: RootState) => state.notification.placeSearch);
  const { placeName } = placeSearch;

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationPlaceSearch({ ...placeSearch, [evt.target.name]: evt.target.value }));
  };

  const searchPlaces = async () => {
    const placeResponse = await fetch(`/api/notification/list/?search=${placeName}`);
    if (placeResponse.ok) {
      const placeResult = await (placeResponse.json() as Promise<{ results: NotificationPlaceResult[] }>);

      console.log("PLACE RESPONSE", placeResult);

      if (placeResult && placeResult.results && placeResult.results.length > 0) {
        dispatch(setNotificationPlaceResults(placeResult.results));
      } else {
        dispatch(setNotificationPlaceResults([]));
      }
    }
  };

  return (
    <div className={styles.placeSearch}>
      <h1>{i18n.t("notification.placeSearch.title")}</h1>
      <div>{i18n.t("notification.placeSearch.notice")}</div>

      <div className={`gridLayoutContainer ${styles.search}`}>
        <TextInput
          id="placeName"
          className="gridColumn1"
          label={i18n.t("notification.placeSearch.placeName.label")}
          name="placeName"
          value={placeName}
          onChange={updateSearchText}
        />
        <div className="gridColumn2">
          <Button onClick={searchPlaces}>{i18n.t("notification.button.search")}</Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceSearch;
