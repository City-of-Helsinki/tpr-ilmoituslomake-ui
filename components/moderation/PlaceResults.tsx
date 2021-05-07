import React, { ReactElement, Fragment } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT } from "../../types/constants";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import styles from "./PlaceResults.module.scss";

const PlaceResults = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const placeResults = useSelector((state: RootState) => state.moderation.placeResults);
  const { results, count, next } = placeResults;

  return (
    <div className={`formSection ${styles.placeResults}`}>
      <h2 className="moderation">{`${i18n.t("moderation.placeResults.found")} ${results.length} ${i18n.t("moderation.placeResults.places")}`}</h2>
      <div className={`gridLayoutContainer ${styles.results}`}>
        <h3 className={`${styles.gridColumn1} gridHeader moderation`}>{i18n.t("moderation.placeResults.nameId")}</h3>
        <h3 className={`${styles.gridColumn2} gridHeader moderation`}>{i18n.t("moderation.placeResults.address")}</h3>
        <h3 className={`${styles.gridColumn3} gridHeader moderation`}>{i18n.t("moderation.placeResults.modifiedLast")}</h3>
        <h3 className={`${styles.gridColumn4} gridHeader moderation`}>{i18n.t("moderation.placeResults.publishPermission")}</h3>
        {results
          // .sort((a: ModerationPlaceResult, b: ModerationPlaceResult) => b.created.getTime() - a.created.getTime())
          .map((result) => {
            const { id: targetId, data, published, updated } = result;
            const {
              name,
              address: {
                fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi, neighborhood: neighborhoodFi },
                sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv, neighborhood: neighborhoodSv },
              },
            } = data || {};

            return (
              <Fragment key={`taskresult_${targetId}`}>
                <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                  <Link href={`/notification/info/${targetId}`}>
                    <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                      {`${getDisplayName(router.locale || defaultLocale, name)}${targetId ? ` (${targetId})` : ""}`}
                    </Button>
                  </Link>
                </div>
                <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                  {router.locale !== "sv"
                    ? `${streetFi}${streetFi.length > 0 ? "," : ""} ${postalCodeFi} ${postOfficeFi} ${
                        neighborhoodFi.length > 0 ? `(${neighborhoodFi})` : ""
                      }`
                    : `${streetSv}${streetSv.length > 0 ? "," : ""} ${postalCodeSv} ${postOfficeSv} ${
                        neighborhoodFi.length > 0 ? `(${neighborhoodSv})` : ""
                      }`}
                </div>
                <div className={`${styles.gridColumn3} ${styles.gridContent}`}>{moment(updated).format(DATETIME_FORMAT)}</div>
                <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                  {published ? i18n.t("moderation.placeSearch.publishPermission.yes") : i18n.t("moderation.placeSearch.publishPermission.no")}
                </div>
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default PlaceResults;
