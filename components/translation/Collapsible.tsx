import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { useI18n } from "next-localization";
import { Button, IconMinus, IconPlus } from "hds-react";
import { TaskStatus } from "../../types/constants";
import TaskStatusLabel from "../common/TaskStatusLabel";
import styles from "./Collapsible.module.scss";

interface CollapsibleProps {
  prefix: string;
  section: number;
  title: string;
  taskStatus: TaskStatus;
  isTranslated?: boolean;
  forceExpanded?: boolean;
  children: ReactNode;
}

const Collapsible = ({ prefix, section, title, taskStatus, isTranslated, forceExpanded, children }: CollapsibleProps): ReactElement => {
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
          <h3 className="translation">{section}</h3>
        </div>
        <div className={styles.title}>
          <h3 className="translation">{title}</h3>
        </div>
        <div className={styles.status}>
          <TaskStatusLabel
            prefix={`${prefix}.collapsible`}
            status={isTranslated || taskStatus === TaskStatus.Closed ? TaskStatus.Closed : TaskStatus.InProgress}
            includeIcons
          />
        </div>
        <div className={styles.button}>
          {expanded && (
            <Button variant="secondary" size="small" aria-label={i18n.t(`${prefix}.button.collapse`)} onClick={toggle}>
              <IconMinus aria-hidden />
            </Button>
          )}
          {!expanded && (
            <Button variant="secondary" size="small" aria-label={i18n.t(`${prefix}.button.expand`)} onClick={toggle}>
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
  isTranslated: false,
  forceExpanded: undefined,
};

export default Collapsible;
