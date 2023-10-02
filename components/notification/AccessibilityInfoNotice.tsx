import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { IconPersonWheelchair } from "hds-react";
import { RootState } from "../../state/reducers";
import AccessibilityInfoButton from "../common/AccessibilityInfoButton";
import Notice from "../common/Notice";
import { getValidAccessibilityId } from "../../utils/save";

interface AccessibilityInfoNoticeProps {
  className?: string;
}

const AccessibilityInfoNotice = ({ className }: AccessibilityInfoNoticeProps): ReactElement => {
  const router = useRouter();

  const [isAccessibilityAllowed, setAccessibilityAllowed] = useState<boolean>(false);

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { openingTimesId, openingTimesNotificationId, isNew } = notificationExtra;

  const placeId = isNew ? 0 : openingTimesNotificationId;

  useEffect(() => {
    const checkAccessibilityId = async () => {
      // If validAccessibilityId is undefined, then an error occurred meaning it's not possible to add accessibility info
      // If validAccessibilityId is -1, then this place does not exist yet in the accessibility application
      const validAccessibilityId = await getValidAccessibilityId(notificationId, placeId, isNew, router);
      setAccessibilityAllowed(validAccessibilityId !== undefined && validAccessibilityId.length > 0);
    };

    checkAccessibilityId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Notice
      className={className}
      icon={<IconPersonWheelchair size="xl" aria-hidden />}
      titleKey="notification.message.completeAccessibility.title"
      messageKey={
        isAccessibilityAllowed ? "notification.message.completeAccessibility.message" : "notification.message.completeAccessibility.message2"
      }
      button={
        <AccessibilityInfoButton
          buttonTextKey="notification.button.notifyAccessibility"
          buttonVariant="secondary"
          disabled={!isAccessibilityAllowed}
          notificationId={notificationId}
          placeId={placeId}
          openingTimesId={openingTimesId}
          isNew={isNew}
        />
      }
    />
  );
};

export default AccessibilityInfoNotice;
