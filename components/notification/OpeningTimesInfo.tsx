import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { DATE_FORMAT, DATE_FORMAT_HAUKI, TIME_FORMAT, TIME_FORMAT_HAUKI } from "../../types/constants";
import { OpeningTime } from "../../types/general";
import getOrigin from "../../utils/request";
import styles from "./OpeningTimesInfo.module.scss";

const OpeningTimesInfo = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const [openingTimes, setOpeningTimes] = useState<OpeningTime[]>([]);
  const [startDateMoment, setStartDateMoment] = useState<moment.Moment>();

  const openingTimesId = useSelector((state: RootState) => state.notification.openingTimesId);

  const getOpeningTimesOnMount = async () => {
    if (openingTimesId > 0) {
      // Use this week's Monday as the start date, and fetch the next two weeks opening times
      const thisMondayMoment = moment().isoWeekday(1);
      setStartDateMoment(thisMondayMoment);
      const nextSundayMoment = thisMondayMoment.clone().add(13, "days");
      const startDate = thisMondayMoment.format(DATE_FORMAT_HAUKI);
      const endDate = nextSundayMoment.format(DATE_FORMAT_HAUKI);
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

  const renderOpeningTimes = (offsetDays: number) => {
    if (startDateMoment) {
      // Loop through the days of the week, using the offset for next week's times
      return Array.from(Array(7).keys()).map((dayOfWeek) => {
        const weekday = dayOfWeek + offsetDays;

        const weekdayMoment = startDateMoment.clone().add(weekday, "days");
        const weekdayOpeningTimes = openingTimes.find((openingTime) => {
          const { date = "" } = openingTime || {};
          const dateMoment = moment(date, DATE_FORMAT_HAUKI);
          return dateMoment.isSame(weekdayMoment, "day");
        });
        const { times = [] } = weekdayOpeningTimes || {};
        const dayKey = `openingtime_${weekday}`;

        return (
          <div key={dayKey} className={`${styles.gridContent}`}>
            <div className={styles.weekday}>{`${i18n.t(`common.weekDay.${weekdayMoment.isoWeekday()}`)} ${weekdayMoment.format(DATE_FORMAT)}`}</div>

            {times.length === 0 ? (
              <div>{i18n.t("notification.opening.times.noTimes")}</div>
            ) : (
              times.map((time, index) => {
                const { start_time, end_time, resource_state } = time;
                const timeKey = `openingtime_${weekday}_${index}`;

                return (
                  <div key={timeKey}>
                    {`${moment(start_time, TIME_FORMAT_HAUKI).format(TIME_FORMAT)} - ${moment(end_time, TIME_FORMAT_HAUKI).format(
                      TIME_FORMAT
                    )} ${i18n.t(`notification.opening.resourceState.${resource_state}`)}`}
                  </div>
                );
              })
            )}
          </div>
        );
      });
    }

    return <></>;
  };

  return !openingTimes || openingTimes.length === 0 ? (
    <></>
  ) : (
    <div className={`formSection ${styles.openingTimes}`}>
      <h2>{i18n.t("notification.opening.title")}</h2>

      <div className={`gridLayoutContainer ${styles.results}`}>
        <div className={`${styles.gridColumn1}`}>
          <div className={`${styles.gridHeader}`}>{i18n.t("notification.opening.times.thisWeek")}</div>

          {renderOpeningTimes(0)}
        </div>

        <div className={`${styles.gridColumn2}`}>
          <div className={`${styles.gridHeader}`}>{i18n.t("notification.opening.times.nextWeek")}</div>

          {renderOpeningTimes(7)}
        </div>
      </div>
    </div>
  );
};

OpeningTimesInfo.defaultProps = {
  temporaryNotice: false,
};

export default OpeningTimesInfo;
