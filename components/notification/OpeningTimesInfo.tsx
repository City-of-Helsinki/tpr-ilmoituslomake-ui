import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { OpeningTime } from "../../types/general";
import getOrigin from "../../utils/request";
import styles from "./OpeningTimesInfo.module.scss";
import { DATE_FORMAT, TIME_FORMAT } from "../../types/constants";

const OpeningTimesInfo = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const [openingTimes, setOpeningTimes] = useState<OpeningTime[]>([]);

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);

  const getOpeningTimesOnMount = async () => {
    if (notificationId > 0) {
      const openingTimesResponse = await fetch(`${getOrigin(router)}/api/openingtimes/get/${notificationId}/?start_date=0w&end_date=0w`);
      if (openingTimesResponse.ok) {
        const openingTimesResult = await (openingTimesResponse.json() as Promise<OpeningTime[]>);

        console.log("OPENING TIMES RESPONSE", openingTimesResult);

        setOpeningTimes(openingTimesResult || []);
      }
    }
  };

  // Get the opening times on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(getOpeningTimesOnMount);

  return !openingTimes || openingTimes.length === 0 ? (
    <></>
  ) : (
    <div className={`formSection ${styles.openingTimes}`}>
      <h2>{i18n.t("notification.opening.title")}</h2>

      <div className={`gridLayoutContainer ${styles.results}`}>
        <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>
          <div className={styles.flexItem}>{i18n.t("notification.opening.times.date")}</div>
        </div>
        <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>
          <div className={styles.flexItem}>{i18n.t("notification.opening.times.opens")}</div>
        </div>
        <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>
          <div className={styles.flexItem}>{i18n.t("notification.opening.times.closes")}</div>
        </div>
        <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>
          <div className={styles.flexItem}>{i18n.t("notification.opening.times.status")}</div>
        </div>

        {openingTimes.map((openingTime, index1) => {
          const { date = "", times = [] } = openingTime || {};

          return times.map((time, index2) => {
            const { start_time, end_time, resource_state } = time;
            const key2 = `openingtime_${index1}_${index2}`;

            return (
              <Fragment key={key2}>
                <div className={`${styles.gridColumn1} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>{moment(date, "YYYY-MM-DD").format(DATE_FORMAT)}</div>
                </div>
                <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>{moment(start_time, "HH:mm:ss").format(TIME_FORMAT)}</div>
                </div>
                <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>{moment(end_time, "HH:mm:ss").format(TIME_FORMAT)}</div>
                </div>
                <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>{resource_state}</div>
                </div>
              </Fragment>
            );
          });
        })}
      </div>
    </div>
  );
};

OpeningTimesInfo.defaultProps = {
  temporaryNotice: false,
};

export default OpeningTimesInfo;
