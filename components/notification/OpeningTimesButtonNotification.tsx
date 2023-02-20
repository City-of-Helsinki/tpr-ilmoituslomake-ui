import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/reducers";
import OpeningTimesButton from "../common/OpeningTimesButton";

interface OpeningTimesButtonNotificationProps {
  buttonTextKey: string;
  buttonVariant: "primary" | "secondary";
  closeModal?: () => void;
}

const OpeningTimesButtonNotification = ({ buttonTextKey, buttonVariant, closeModal }: OpeningTimesButtonNotificationProps): ReactElement => {
  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notification = useSelector((state: RootState) => state.notification.notification);

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { openingTimesId, openingTimesNotificationId, isNew } = notificationExtra;

  return (
    <OpeningTimesButton
      buttonTextKey={buttonTextKey}
      buttonVariant={buttonVariant}
      closeModal={closeModal}
      notificationId={openingTimesNotificationId > 0 ? openingTimesNotificationId : notificationId}
      notification={notification}
      openingTimesId={openingTimesId}
      isNew={isNew}
    />
  );
};

export default OpeningTimesButtonNotification;
