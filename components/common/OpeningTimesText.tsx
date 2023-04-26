import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { OpeningTimeResult } from "../../types/general";
import { parseOpeningTimesText } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import styles from "./OpeningTimesText.module.scss";

interface OpeningTimesTextProps {
  className?: string;
  openingTimes: OpeningTimeResult[];
}

const OpeningTimesText = ({ className, openingTimes }: OpeningTimesTextProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const renderOpeningTimes = (locale: string) => {
    if (!openingTimes) return;

    return openingTimes.map((openingTime, index) => {
      if (!openingTime.date_periods_as_text) return;

      const openingTimeRows = parseOpeningTimesText(openingTime.date_periods_as_text[locale], i18n, router);

      return openingTimeRows.map((openingTimeRow, rowIndex) => {
        const key = `openingtime_${index}_${rowIndex}`;

        return (
          <div key={key} className={styles.resultRow}>
            {openingTimeRow}
          </div>
        );
      });
    });
  };

  return !openingTimes || openingTimes.length === 0 ? (
    <></>
  ) : (
    <div className={`${styles.openingTimesResults} ${className}`}>{renderOpeningTimes(router.locale || defaultLocale)}</div>
  );
};

OpeningTimesText.defaultProps = {
  className: "",
};

export default OpeningTimesText;
