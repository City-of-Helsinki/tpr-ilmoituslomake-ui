import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconTrash } from "hds-react";
import styles from "./TaskHeader.module.scss";

const TaskHeader = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.taskHeader}>
      <h3>PLACE TITLE</h3>

      <div className={styles.buttonRow}>
        <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button>
        <Button variant="secondary" iconRight={<IconArrowUndo />}>
          {i18n.t("moderation.button.rejectChangeRequest")}
        </Button>
        <Button variant="secondary" iconRight={<IconTrash />}>
          {i18n.t("moderation.button.removePlace")}
        </Button>
        <Button variant="secondary">{i18n.t("moderation.button.saveIncomplete")}</Button>
        <Button iconRight={<IconArrowRight />}>{i18n.t("moderation.button.saveInformation")}</Button>
      </div>

      <div className={styles.upperRow}>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.taskType")}</div>
          <div>TODO</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.publishPermission")}</div>
          <div>TODO</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.status")}</div>
          <div>TODO</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.moderator")}</div>
          <div>TODO</div>
        </div>
      </div>

      <div className={styles.lowerRow}>
        <div className={styles.notifier}>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.notifier")}</div>
          <div>TODO</div>
        </div>
        <div className={styles.comment}>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.messageFromNotifier")}</div>
          <div>TODO</div>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
