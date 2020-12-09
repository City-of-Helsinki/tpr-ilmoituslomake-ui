import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { StatusLabel } from "hds-react";
import { TaskStatus } from "../../types/constants";

interface TaskStatusLabelProps {
  status: TaskStatus;
}

const TaskStatusLabel = ({ status }: TaskStatusLabelProps): ReactElement | null => {
  const i18n = useI18n();

  switch (status) {
    case TaskStatus.Open: {
      return <StatusLabel type="alert">{i18n.t("moderation.taskStatus.open")}</StatusLabel>;
    }
    case TaskStatus.InProgress: {
      return <StatusLabel type="success">{i18n.t("moderation.taskStatus.inProgress")}</StatusLabel>;
    }
    default: {
      return null;
    }
  }
};

export default TaskStatusLabel;
