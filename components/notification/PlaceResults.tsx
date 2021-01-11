import React, { ReactElement, Fragment } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconAngleRight, IconLocation } from "hds-react";
import { RootState } from "../../state/reducers";
import { NotificationPlaceResult } from "../../types/general";
import { defaultLocale } from "../../utils/i18n";
import Notice from "../common/Notice";
import styles from "./PlaceResults.module.scss";

const PlaceResults = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const placeResults = useSelector((state: RootState) => state.notification.placeResults);

  return (
    <div className={`formSection ${styles.placeResults}`}>
      <h3>{`${i18n.t("notification.placeResults.found")} ${placeResults.length} ${i18n.t("notification.placeResults.places")}`}</h3>

      <div className={`gridLayoutContainer ${styles.results}`}>
        {placeResults
          .sort((a: NotificationPlaceResult, b: NotificationPlaceResult) => {
            const nameA = (a.data.name[router.locale || defaultLocale] as string) ?? "";
            const nameB = (b.data.name[router.locale || defaultLocale] as string) ?? "";
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
            } = result;
            return (
              <Fragment key={`placeresult_${id}`}>
                <div className={`gridColumn1 ${styles.gridContent} ${styles.firstColumn} ${styles.gridButton}`}>
                  <Link href={`/notification/${id}`}>
                    <Button variant="supplementary" size="small" iconRight={<IconAngleRight />}>
                      {name[router.locale || defaultLocale] as string}
                    </Button>
                  </Link>
                </div>
                <div className={`gridColumn2 ${styles.gridContent} ${styles.lastColumn}`}>
                  <IconLocation />
                  <span>
                    {router.locale !== "sv"
                      ? `${streetFi}${streetFi.length > 0 ? "," : ""} ${postalCodeFi} ${postOfficeFi}`
                      : `${streetSv}${streetSv.length > 0 ? "," : ""} ${postalCodeSv} ${postOfficeSv}`}
                  </span>
                </div>
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

export default PlaceResults;
