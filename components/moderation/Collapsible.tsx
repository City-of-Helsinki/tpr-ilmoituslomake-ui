import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { useI18n } from "next-localization";
import { Button, IconMinus, IconPlus } from "hds-react";
import { TaskStatus, TaskType } from "../../types/constants";
import TaskStatusLabel from "../common/TaskStatusLabel";
import styles from "./Collapsible.module.scss";

interface CollapsibleProps {
  section: number;
  title: string;
  taskType: TaskType;
  taskStatus: TaskStatus;
  isModerated?: boolean;
  forceExpanded?: boolean;
  children: ReactNode;
}

const Collapsible = ({ section, title, taskType, taskStatus, isModerated, forceExpanded, children }: CollapsibleProps): ReactElement => {
  const i18n = useI18n();
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggle = () => {
    setExpanded(!expanded);

    // Force a resize event to make sure maps render properly inside the collapsible container
    window.dispatchEvent(new Event("resize"));
  };

  useEffect(() => {
    if (forceExpanded !== undefined) {
      setExpanded(forceExpanded);
    }
  }, [forceExpanded, setExpanded]);

  return (
    <div className={styles.collapsible}>
      <div className={styles.header}>
        <div className={styles.section}>
          <h3 className="moderation">{section}</h3>
        </div>
        <div className={styles.title}>
          <h3 className="moderation">{title}</h3>
        </div>
        <div className={styles.status}>
          {(taskType === TaskType.NewPlace ||
            taskType === TaskType.PlaceChange ||
            taskType === TaskType.ChangeTip ||
            taskType === TaskType.AddTip ||
            taskType === TaskType.ModeratorChange ||
            taskType === TaskType.ModeratorAdd) && (
            <TaskStatusLabel
              prefix="moderation"
              status={
                isModerated || taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled
                  ? TaskStatus.Closed
                  : TaskStatus.InProgress
              }
            />
          )}
        </div>
        <div className={styles.button}>
          {expanded && (
            <Button variant="secondary" size="small" aria-label={i18n.t("moderation.button.collapse")} onClick={toggle}>
              <IconMinus aria-hidden />
            </Button>
          )}
          {!expanded && (
            <Button variant="secondary" size="small" aria-label={i18n.t("moderation.button.expand")} onClick={toggle}>
              <IconPlus aria-hidden />
            </Button>
          )}
        </div>
      </div>
      <div className={expanded ? styles.expanded : styles.collapsed}>{children}</div>
    </div>
  );
};

Collapsible.defaultProps = {
  isModerated: false,
  forceExpanded: undefined,
};

export default Collapsible;
