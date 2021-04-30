import React, { Dispatch, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconAngleRight, IconLocation, IconStarFill } from "hds-react";
import moment from "moment";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationPlaceResults } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { NotifierType } from "../../types/constants";
import { NotificationPlaceResult } from "../../types/general";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import Notice from "../common/Notice";
import styles from "./PlaceResults.module.scss";

interface PlaceResultsProps {
  showOwnPlaces?: boolean;
}

const PlaceResults = ({ showOwnPlaces }: PlaceResultsProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const placeResults = useSelector((state: RootState) => state.notification.placeResults);
  const { results, count, next } = placeResults;
  const placeSearch = useSelector((state: RootState) => state.notification.placeSearch);
  const { searchDone, ownPlacesOnly } = placeSearch;

  // Show the user's own places if they are logged in
  const ownPlaces = showOwnPlaces || currentUser?.authenticated;

  const fetchMoreResults = async () => {
    if (next) {
      const placeResponse = await fetch(next);
      if (placeResponse.ok) {
        const placeResult = await (placeResponse.json() as Promise<{ count: number; next: string; results: NotificationPlaceResult[] }>);

        console.log("PLACE RESPONSE", placeResult);

        if (placeResult && placeResult.results && placeResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = placeResult;

          dispatch(
            setNotificationPlaceResults({
              results: [
                ...results,
                ...moreResults.filter((result) => {
                  const {
                    data: { notifier: { notifier_type: notifierType } = {} },
                    is_notifier: isNotifier,
                  } = result;

                  // This is the user's own place if they made the notification and they marked themselves as the place's representative
                  const isOwnPlace = isNotifier && notifierType === NotifierType.Representative;

                  return !ownPlaces || !ownPlacesOnly || isOwnPlace;
                }),
              ],
              count,
              next: nextBatch,
            })
          );
        }
      }
    }
  };

  return (
    <div className={`formSection ${styles.placeResults}`}>
      {results.length > 0 && (
        <h2>{`${i18n.t("notification.placeResults.found")} ${results.length} / ${count} ${i18n.t("notification.placeResults.places")}`}</h2>
      )}

      {searchDone && results.length === 0 && <h2>{i18n.t("notification.placeResults.notFound")}</h2>}
      {searchDone && results.length === 0 && <div className={styles.notFoundTip}>{i18n.t("notification.placeResults.notFoundTip")}</div>}

      {results.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          {results
            /*
            .sort((a: NotificationPlaceResult, b: NotificationPlaceResult) => {
              // Sort by name asc
              const nameA = getDisplayName(router.locale || defaultLocale, a.data.name);
              const nameB = getDisplayName(router.locale || defaultLocale, b.data.name);
              return nameA.localeCompare(nameB);
            })
            */
            .sort((a: NotificationPlaceResult, b: NotificationPlaceResult) => {
              // Sort by date desc
              const updatedA = moment(a.updated_at);
              const updatedB = moment(b.updated_at);
              return updatedB.isBefore(updatedA) ? -1 : 1;
            })
            .map((result) => {
              const {
                id,
                data: {
                  name,
                  address: {
                    fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi, neighborhood: neighborhoodFi },
                    sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv, neighborhood: neighborhoodSv },
                  },
                  notifier: { notifier_type: notifierType } = {},
                },
                is_notifier: isNotifier,
              } = result;

              // This is the user's own place if they made the notification and they marked themselves as the place's representative
              const isOwnPlace = isNotifier && notifierType === NotifierType.Representative;

              return (
                <Fragment key={`placeresult_${id}`}>
                  <div className={`${styles.gridContent} ${styles.firstColumn} ${styles.gridButton}`}>
                    <Link href={`/notification/info/${id}`}>
                      <Button variant="supplementary" size="small" iconRight={<IconAngleRight aria-hidden />}>
                        {getDisplayName(router.locale || defaultLocale, name)}
                      </Button>
                    </Link>
                  </div>
                  <div className={`${styles.gridContent} ${styles.middleColumn} ${ownPlaces ? styles.ownPlaces : ""}`}>
                    <div className={styles.addressContainer}>
                      <IconLocation aria-hidden />
                      <div className={styles.addressLabel}>
                        {router.locale !== "sv"
                          ? `${streetFi}${streetFi.length > 0 ? "," : ""} ${postalCodeFi} ${postOfficeFi} ${
                              neighborhoodFi.length > 0 ? `(${neighborhoodFi})` : ""
                            }`
                          : `${streetSv}${streetSv.length > 0 ? "," : ""} ${postalCodeSv} ${postOfficeSv} ${
                              neighborhoodFi.length > 0 ? `(${neighborhoodSv})` : ""
                            }`}
                      </div>
                    </div>
                  </div>
                  {ownPlaces && (
                    <div className={`${styles.gridContent} ${styles.lastColumn}`}>
                      {isOwnPlace && (
                        <div className={styles.ownPlaceContainer}>
                          <div className={styles.ownPlace}>
                            <IconStarFill aria-hidden />
                            <div className={styles.ownPlaceLabel}>{i18n.t("notification.placeResults.ownPlace")}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Fragment>
              );
            })}
        </div>
      )}

      <div className={styles.nextResults}>
        {next && (
          <Button variant="secondary" onClick={fetchMoreResults}>
            {i18n.t("notification.button.showMore")}
          </Button>
        )}
      </div>

      {searchDone && (
        <Notice
          className={styles.newPlace}
          icon={<IconLocation size="xl" aria-hidden />}
          titleKey="notification.placeResults.newPlace.title"
          messageKey="notification.placeResults.newPlace.notice"
          button={
            <Link href="/notification">
              <Button variant="secondary">{i18n.t("notification.button.notifyNewPlace")}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
};

PlaceResults.defaultProps = {
  showOwnPlaces: false,
};

export default PlaceResults;
