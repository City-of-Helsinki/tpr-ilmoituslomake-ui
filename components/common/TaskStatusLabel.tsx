import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { IconCheck, StatusLabel } from "hds-react";
import { TaskStatus } from "../../types/constants";

interface TaskStatusLabelProps {
  prefix: string;
  status: TaskStatus;
  includeIcons?: boolean;
}

const TaskStatusLabel = ({ prefix, status, includeIcons }: TaskStatusLabelProps): ReactElement | null => {
  const i18n = useI18n();

  switch (status) {
    case TaskStatus.Open: {
      return <StatusLabel type="alert">{i18n.t(`${prefix}.taskStatus.open`)}</StatusLabel>;
    }
    case TaskStatus.InProgress: {
      return <StatusLabel type="info">{i18n.t(`${prefix}.taskStatus.inProgress`)}</StatusLabel>;
    }
    case TaskStatus.Closed: {
      return (
        <StatusLabel type="success" iconLeft={includeIcons && <IconCheck />}>
          {i18n.t(`${prefix}.taskStatus.closed`)}
        </StatusLabel>
      );
    }
    case TaskStatus.Rejected: {
      return <StatusLabel type="error">{i18n.t(`${prefix}.taskStatus.rejected`)}</StatusLabel>;
    }
    case TaskStatus.Cancelled: {
      return <StatusLabel type="success">{i18n.t(`${prefix}.taskStatus.cancelled`)}</StatusLabel>;
    }
    default: {
      return null;
    }
  }
};

TaskStatusLabel.defaultProps = {
  includeIcons: false,
};

export default TaskStatusLabel;
