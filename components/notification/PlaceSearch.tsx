import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, RadioButton, SelectionGroup, TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationPlaceResults, setNotificationPlaceSearch } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { NotificationPlaceResult } from "../../types/general";
import getOrigin from "../../utils/request";
import styles from "./PlaceSearch.module.scss";

interface PlaceSearchProps {
  showOwnPlaces?: boolean;
}

const PlaceSearch = ({ showOwnPlaces }: PlaceSearchProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const placeSearch = useSelector((state: RootState) => state.notification.placeSearch);
  const { placeName, ownPlacesOnly } = placeSearch;

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationPlaceSearch({ ...placeSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchOption = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationPlaceSearch({ ...placeSearch, [evt.target.name]: Boolean(evt.target.value === "yes") }));
  };

  const searchPlaces = async () => {
    const placeResponse = await fetch(`${getOrigin(router)}/api/notification/list/?search=${placeName.trim()}`);
    if (placeResponse.ok) {
      const placeResult = await (placeResponse.json() as Promise<{ results: NotificationPlaceResult[] }>);

      console.log("PLACE RESPONSE", placeResult);

      if (placeResult && placeResult.results && placeResult.results.length > 0) {
        dispatch(setNotificationPlaceResults(placeResult.results.filter((result) => !showOwnPlaces || !ownPlacesOnly || result.is_notifier)));
      } else {
        dispatch(setNotificationPlaceResults([]));
      }
    }
  };

  return (
    <div className={`formSection ${styles.placeSearch}`}>
      <h1>{i18n.t("notification.placeSearch.title")}</h1>
      <div>{i18n.t("notification.placeSearch.notice")}</div>

      <div className={`gridLayoutContainer ${styles.search}`}>
        <TextInput
          id="placeName"
          className={styles.gridInput}
          label={i18n.t("notification.placeSearch.placeName.label")}
          name="placeName"
          value={placeName}
          onChange={updateSearchText}
        />
        <div className={styles.gridButton}>
          <Button onClick={searchPlaces}>{i18n.t("notification.button.search")}</Button>
        </div>

        {showOwnPlaces && (
          <div className={styles.gridInput}>
            <SelectionGroup id="ownPlacesOnly" direction="horizontal" label={i18n.t("notification.placeSearch.ownPlacesOnly.label")}>
              <RadioButton
                id="ownPlacesOnly_yes"
                label={i18n.t("notification.placeSearch.ownPlacesOnly.yes")}
                name="ownPlacesOnly"
                value="yes"
                checked={ownPlacesOnly}
                onChange={updateSearchOption}
              />
              <RadioButton
                id="ownPlacesOnly_no"
                label={i18n.t("notification.placeSearch.ownPlacesOnly.no")}
                name="ownPlacesOnly"
                value="no"
                checked={!ownPlacesOnly}
                onChange={updateSearchOption}
              />
            </SelectionGroup>
          </div>
        )}
      </div>
    </div>
  );
};

PlaceSearch.defaultProps = {
  showOwnPlaces: false,
};

export default PlaceSearch;
