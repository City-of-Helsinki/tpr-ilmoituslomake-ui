import React, { ReactElement, Fragment } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconAngleRight, IconLocation, IconStarFill } from "hds-react";
import { RootState } from "../../state/reducers";
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
  const router = useRouter();

  const placeResults = useSelector((state: RootState) => state.notification.placeResults);

  return (
    <div className={`formSection ${styles.placeResults}`}>
      <h2>{`${i18n.t("notification.placeResults.found")} ${placeResults.length} ${i18n.t("notification.placeResults.places")}`}</h2>

      <div className={`gridLayoutContainer ${styles.results}`}>
        {placeResults
          .sort((a: NotificationPlaceResult, b: NotificationPlaceResult) => {
            const nameA = getDisplayName(router.locale || defaultLocale, a.data.name);
            const nameB = getDisplayName(router.locale || defaultLocale, b.data.name);
            return nameA.localeCompare(nameB);
          })
          .map((result) => {
            const {
              id,
              data: {
                name,
                address: {
                  fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi },
                  sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv },
                },
              },
              is_notifier: isNotifier,
            } = result;
            return (
              <Fragment key={`placeresult_${id}`}>
                <div className={`${styles.gridContent} ${styles.firstColumn} ${styles.gridButton}`}>
                  <Link href={`/notification/info/${id}`}>
                    <Button variant="supplementary" size="small" iconRight={<IconAngleRight />}>
                      {getDisplayName(router.locale || defaultLocale, name)}
                    </Button>
                  </Link>
                </div>
                <div className={`${styles.gridContent} ${styles.middleColumn} ${showOwnPlaces ? styles.ownPlaces : ""}`}>
                  <div className={styles.addressContainer}>
                    <IconLocation />
                    <div className={styles.addressLabel}>
                      {router.locale !== "sv"
                        ? `${streetFi}${streetFi.length > 0 ? "," : ""} ${postalCodeFi} ${postOfficeFi}`
                        : `${streetSv}${streetSv.length > 0 ? "," : ""} ${postalCodeSv} ${postOfficeSv}`}
                    </div>
                  </div>
                </div>
                {showOwnPlaces && (
                  <div className={`${styles.gridContent} ${styles.lastColumn}`}>
                    {isNotifier && (
                      <div className={styles.ownPlaceContainer}>
                        <div className={styles.ownPlace}>
                          <IconStarFill />
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

      <Notice
        className={styles.newPlace}
        icon={<IconLocation size="xl" />}
        titleKey="notification.placeResults.newPlace.title"
        messageKey="notification.placeResults.newPlace.notice"
        button={
          <Link href="/notification">
            <Button variant="secondary">{i18n.t("notification.button.notifyNewPlace")}</Button>
          </Link>
        }
      />
    </div>
  );
};

PlaceResults.defaultProps = {
  showOwnPlaces: false,
};

export default PlaceResults;
