import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { NextRouter, useRouter } from "next/router";
import { useI18n } from "next-localization";
import moment from "moment";
import { TranslationAction } from "../../state/actions/translationTypes";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, TaskType, Toast } from "../../types/constants";
import { TranslationExtra, User } from "../../types/general";
import { TranslationSchema } from "../../types/translation_schema";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "../common/TaskStatusLabel";
import ValidationSummary from "../common/ValidationSummary";
import TaskHeaderButtons from "./TaskHeaderButtons";
import styles from "./TaskHeader.module.scss";

interface TaskHeaderProps {
  prefix: string;
  buttonsPrefix?: string;
  backHref: string;
  saveTranslation: (
    currentUser: User | undefined,
    translatedTaskId: number,
    translatedTask: TranslationSchema,
    translationExtra: TranslationExtra,
    draft: boolean,
    router: NextRouter,
    dispatchValidation: Dispatch<TranslationAction>,
    setToast: Dispatch<SetStateAction<Toast | undefined>>
  ) => void;
}

const TaskHeader = ({ prefix, buttonsPrefix, backHref, saveTranslation }: TaskHeaderProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const pageValid = useSelector((state: RootState) => state.translation.taskPageValid);
  const selectedTaskId = useSelector((state: RootState) => state.translation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.translation.selectedTask);
  const { name: placeNameSelected } = selectedTask;

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    translationRequest: {
      formattedRequest,
      language: { from: translateFrom, to: translateTo },
      message,
      translator: { name: translatorName },
      moderator: { fullName: moderatorName },
    },
    translationTask: { created_at, taskType, taskStatus },
  } = translationExtra;

  return (
    <div className={styles.taskHeader}>
      <h1 className="translation">
        {getDisplayName(router.locale || defaultLocale, placeNameSelected)}
        {selectedTaskId ? ` (${selectedTaskId})` : ""}
      </h1>

      <div className={styles.validationSummary}>{!pageValid && <ValidationSummary prefix={buttonsPrefix ?? prefix} />}</div>

      <TaskHeaderButtons prefix={buttonsPrefix ?? prefix} backHref={backHref} saveTranslation={saveTranslation} />

      <div className={styles.upperRow}>
        <div>
          <div className={styles.bold}>{i18n.t(`${prefix}.taskHeader.taskType`)}</div>
          <div>{taskType !== TaskType.Unknown ? i18n.t(`${prefix}.taskType.${taskType}`) : ""}</div>
          <div>{`${translateFrom.toUpperCase()}-${translateTo.toUpperCase()}`}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t(`${prefix}.taskHeader.created`)}</div>
          <div>{moment(created_at).format(DATETIME_FORMAT)}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t(`${prefix}.taskHeader.status`)}</div>
          <div>
            <TaskStatusLabel prefix={prefix} status={taskStatus} includeIcons />
          </div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t(`${prefix}.taskHeader.translator`)}</div>
          <div>{translatorName}</div>
        </div>
      </div>

      <div className={styles.lowerRow}>
        <div className={styles.moderator}>
          <div className={styles.bold}>{i18n.t(`${prefix}.taskHeader.request`)}</div>
          <div>{formattedRequest}</div>
          <div className={styles.bold}>{i18n.t(`${prefix}.taskHeader.moderator`)}</div>
          <div>{moderatorName}</div>
        </div>

        <div className={styles.comment}>
          <div className={styles.bold}>{i18n.t(`${prefix}.taskHeader.messageFromModerator`)}</div>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};

TaskHeader.defaultProps = {
  buttonsPrefix: undefined,
};

export default TaskHeader;
