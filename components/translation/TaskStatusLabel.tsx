import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { IconCheck, StatusLabel } from "hds-react";
import { TaskStatus } from "../../types/constants";

interface TaskStatusLabelProps {
  status: TaskStatus;
}

const TaskStatusLabel = ({ status }: TaskStatusLabelProps): ReactElement | null => {
  const i18n = useI18n();

  switch (status) {
    case TaskStatus.Open: {
      return <StatusLabel type="alert">{i18n.t("translation.taskStatus.open")}</StatusLabel>;
    }
    case TaskStatus.InProgress: {
      return <StatusLabel type="info">{i18n.t("translation.taskStatus.inProgress")}</StatusLabel>;
    }
    case TaskStatus.Closed: {
      return (
        <StatusLabel type="success" iconLeft={<IconCheck />}>
          {i18n.t("translation.taskStatus.closed")}
        </StatusLabel>
      );
    }
    default: {
      return null;
    }
  }
};

export default TaskStatusLabel;
