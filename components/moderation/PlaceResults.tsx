import React, { Dispatch, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Link as HdsLink } from "hds-react";
import moment from "moment";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { setModerationPlaceResults } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT } from "../../types/constants";
import { ModerationPlaceResult } from "../../types/general";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import styles from "./PlaceResults.module.scss";

const PlaceResults = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const router = useRouter();

  const placeResults = useSelector((state: RootState) => state.moderation.placeResults);
  const { results, count, next } = placeResults;
  const placeSearch = useSelector((state: RootState) => state.moderation.placeSearch);
  const { searchDone } = placeSearch;

  const fetchMoreResults = async () => {
    if (next) {
      const placeResponse = await fetch(next);
      if (placeResponse.ok) {
        const placeResult = await (placeResponse.json() as Promise<{ count: number; next: string; results: ModerationPlaceResult[] }>);

        console.log("PLACE RESPONSE", placeResult);

        if (placeResult && placeResult.results && placeResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = placeResult;

          // Parse the date strings to date objects
          dispatch(
            setModerationPlaceResults({
              results: [
                ...results,
                ...moreResults.map((result) => {
                  return {
                    ...result,
                    updated: moment(result.updated_at).toDate(),
                  };
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
        <h2 className="moderation">{`${i18n.t("moderation.placeResults.found")} ${results.length} / ${count} ${i18n.t(
          "moderation.placeResults.places"
        )}`}</h2>
      )}

      {searchDone && results.length === 0 && <h2 className="moderation">{i18n.t("moderation.placeResults.notFound")}</h2>}

      {results.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.placeResults.nameId")}</div>
          </div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.placeResults.address")}</div>
          </div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.placeResults.modifiedLast")}</div>
          </div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.placeResults.publishPermission")}</div>
          </div>

          {results
            .sort((a: ModerationPlaceResult, b: ModerationPlaceResult) => b.updated.getTime() - a.updated.getTime())
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
                <Fragment key={`placeresult_${targetId}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <Link href={`/moderation/place/${targetId}`}>
                        <HdsLink href="#" size="M" disableVisitedStyles>
                          {`${getDisplayName(router.locale || defaultLocale, name)}${targetId ? ` (${targetId})` : ""}`}
                        </HdsLink>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.placeResults.address")}: `}</span>
                      {router.locale !== "sv"
                        ? `${streetFi}${streetFi.length > 0 ? "," : ""} ${postalCodeFi} ${postOfficeFi} ${
                            neighborhoodFi.length > 0 ? `(${neighborhoodFi})` : ""
                          }`
                        : `${streetSv}${streetSv.length > 0 ? "," : ""} ${postalCodeSv} ${postOfficeSv} ${
                            neighborhoodFi.length > 0 ? `(${neighborhoodSv})` : ""
                          }`}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.placeResults.modifiedLast")}: `}</span>
                      {moment(updated).format(DATETIME_FORMAT)}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.placeResults.publishPermission")}: `}</span>
                      {published ? i18n.t("moderation.placeSearch.publishPermission.yes") : i18n.t("moderation.placeSearch.publishPermission.no")}
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}

      <div className={styles.nextResults}>
        {next && (
          <Button variant="secondary" onClick={fetchMoreResults}>
            {i18n.t("moderation.button.showMore")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlaceResults;
