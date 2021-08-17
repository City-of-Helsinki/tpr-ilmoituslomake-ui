import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../../state/reducers";
import styles from "./RequestStatus.module.scss";

const RequestStatus = (): ReactElement => {
  const i18n = useI18n();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { selectedPlaces, taskStatus } = requestDetail;

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.status")}</h2>

      <div className={styles.statusRow}>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.translation.request.request")}</div>
          <div>{i18n.t(`moderation.translation.request.taskStatus.${taskStatus}`)}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.translation.request.translationTasks")}</div>
          <div>{selectedPlaces.length}</div>
        </div>
      </div>
    </div>
  );
};

export default RequestStatus;
