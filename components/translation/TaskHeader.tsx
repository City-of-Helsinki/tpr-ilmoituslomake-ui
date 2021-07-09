import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, TaskType } from "../../types/constants";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "../common/TaskStatusLabel";
import TaskHeaderButtons from "./TaskHeaderButtons";
import styles from "./TaskHeader.module.scss";

interface TaskHeaderProps {
  isTranslated?: boolean;
}

const TaskHeader = ({ isTranslated }: TaskHeaderProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const selectedTaskId = useSelector((state: RootState) => state.translation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.translation.selectedTask);
  const { name: placeNameSelected } = selectedTask;

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    request,
    language: { from: translateFrom, to: translateTo },
    message,
    created_at,
    taskType,
    taskStatus,
    translator: { name: translatorName },
    moderator: { fullName: moderatorName },
  } = translationExtra;

  return (
    <div className={styles.taskHeader}>
      <h1 className="translation">
        {getDisplayName(router.locale || defaultLocale, placeNameSelected)}
        {selectedTaskId ? ` (${selectedTaskId})` : ""}
      </h1>

      <TaskHeaderButtons isTranslated={isTranslated} />

      <div className={styles.upperRow}>
        <div>
          <div className={styles.bold}>{i18n.t("translation.taskHeader.taskType")}</div>
          <div>{taskType !== TaskType.Unknown ? i18n.t(`translation.taskType.${taskType}`) : ""}</div>
          <div>{`${translateFrom.toUpperCase()}-${translateTo.toUpperCase()}`}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("translation.taskHeader.created")}</div>
          <div>{moment(created_at).format(DATETIME_FORMAT)}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("translation.taskHeader.status")}</div>
          <div>
            <TaskStatusLabel prefix="translation" status={taskStatus} includeIcons />
          </div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("translation.taskHeader.translator")}</div>
          <div>{translatorName}</div>
        </div>
      </div>

      <div className={styles.lowerRow}>
        <div className={styles.moderator}>
          <div className={styles.bold}>{i18n.t("translation.taskHeader.request")}</div>
          <div>{request}</div>
          <div className={styles.bold}>{i18n.t("translation.taskHeader.moderator")}</div>
          <div>{moderatorName}</div>
        </div>

        <div className={styles.comment}>
          <div className={styles.bold}>{i18n.t("translation.taskHeader.messageFromModerator")}</div>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};

TaskHeader.defaultProps = {
  isTranslated: false,
};

export default TaskHeader;
