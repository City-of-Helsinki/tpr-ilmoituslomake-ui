import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { useI18n } from "next-localization";
import { Button, IconMinus, IconPlus } from "hds-react";
import { TaskStatus, TaskType } from "../../types/constants";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./Collapsible.module.scss";

interface CollapsibleProps {
  section: number;
  title: string;
  taskType: TaskType;
  isModerated: boolean;
  forceExpanded?: boolean;
  children: ReactNode;
}

const Collapsible = ({ section, title, taskType, isModerated, forceExpanded, children }: CollapsibleProps): ReactElement => {
  const i18n = useI18n();
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggle = () => {
    setExpanded(!expanded);
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
          <h2 className="moderation">{section}</h2>
        </div>
        <div className={styles.title}>
          <h3 className="moderation">{title}</h3>
        </div>
        <div className={styles.status}>
          {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
            <TaskStatusLabel status={isModerated ? TaskStatus.Closed : TaskStatus.InProgress} />
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
  forceExpanded: undefined,
};

export default Collapsible;
