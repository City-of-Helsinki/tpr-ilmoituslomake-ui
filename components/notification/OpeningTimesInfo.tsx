import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";
import { OpeningTimeResult, OpeningTimeResults } from "../../types/general";
import getOrigin from "../../utils/request";
import OpeningTimesText from "../common/OpeningTimesText";
import styles from "./OpeningTimesInfo.module.scss";

const OpeningTimesInfo = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const [openingTimes, setOpeningTimes] = useState<OpeningTimeResult[]>([]);

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  // const openingTimesId = useSelector((state: RootState) => state.notification.openingTimesId);

  const getOpeningTimesOnMount = async () => {
    const openingTimesResponse = await fetch(`${getOrigin(router)}/api/openingtimes/get/${notificationId}/`);
    if (openingTimesResponse.ok) {
      const openingTimesResults = await (openingTimesResponse.json() as Promise<OpeningTimeResults>);

      console.log("OPENING TIMES RESPONSE", openingTimesResults);

      setOpeningTimes(openingTimesResults.results || []);
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
      <OpeningTimesText className={styles.results} openingTimes={openingTimes} />
    </div>
  );
};

export default OpeningTimesInfo;
