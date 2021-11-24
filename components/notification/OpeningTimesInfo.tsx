import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { OpeningTime } from "../../types/general";
import getOrigin from "../../utils/request";
import styles from "./OpeningTimesInfo.module.scss";
import { DATE_FORMAT, DATE_FORMAT_HAUKI, TIME_FORMAT, TIME_FORMAT_HAUKI } from "../../types/constants";

const OpeningTimesInfo = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const [openingTimes, setOpeningTimes] = useState<OpeningTime[]>([]);

  const openingTimesId = useSelector((state: RootState) => state.notification.openingTimesId);

  const getOpeningTimesOnMount = async () => {
    if (openingTimesId > 0) {
      // Use this week's Monday as the start date, and fetch the next two weeks opening times
      const startDateMoment = moment().isoWeekday(1);
      const endDateMoment = startDateMoment.clone().add(13, "days");
      const startDate = startDateMoment.format(DATE_FORMAT_HAUKI);
      const endDate = endDateMoment.format(DATE_FORMAT_HAUKI);
      const openingTimesResponse = await fetch(
        `${getOrigin(router)}/api/openingtimes/get/${openingTimesId}/?start_date=${startDate}&end_date=${endDate}`
      );
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
          const dateMoment = moment(date, DATE_FORMAT_HAUKI);

          return times.map((time, index2) => {
            const { start_time, end_time, resource_state } = time;
            const key2 = `openingtime_${index1}_${index2}`;

            return (
              <Fragment key={key2}>
                <div className={`${styles.gridColumn1} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>{`${i18n.t(`common.weekDay.${dateMoment.isoWeekday()}`)} ${dateMoment.format(DATE_FORMAT)}`}</div>
                </div>
                <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>{moment(start_time, TIME_FORMAT_HAUKI).format(TIME_FORMAT)}</div>
                </div>
                <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>{moment(end_time, TIME_FORMAT_HAUKI).format(TIME_FORMAT)}</div>
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
