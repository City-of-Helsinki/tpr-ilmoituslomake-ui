import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/reducers";
import { TaskStatus } from "../../types/constants";
import OpeningTimesButton from "../common/OpeningTimesButton";

interface OpeningTimesButtonModerationProps {
  buttonTextKey: string;
  buttonVariant: "primary" | "secondary";
}

const OpeningTimesButtonModeration = ({ buttonTextKey, buttonVariant }: OpeningTimesButtonModerationProps): ReactElement => {
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { openingTimesId, openingTimesNotificationId, published, taskStatus } = moderationExtra;

  return (
    <OpeningTimesButton
      buttonTextKey={buttonTextKey}
      buttonVariant={buttonVariant}
      notificationId={openingTimesNotificationId}
      notification={modifiedTask}
      placeId={selectedTaskId}
      openingTimesId={openingTimesId}
      isNew={!published}
      disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
    />
  );
};

export default OpeningTimesButtonModeration;
