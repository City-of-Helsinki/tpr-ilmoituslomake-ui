import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import { RootState } from "../../state/reducers";
import { getOpeningTimesLink } from "../../utils/save";

interface OpeningTimesButtonProps {
  buttonTextKey: string;
  buttonVariant: "primary" | "secondary";
}

const OpeningTimesButton = ({ buttonTextKey, buttonVariant }: OpeningTimesButtonProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notification = useSelector((state: RootState) => state.notification.notification);
  const openingTimesId = useSelector((state: RootState) => state.notification.openingTimesId);
  const openingTimesNotificationId = useSelector((state: RootState) => state.notification.openingTimesNotificationId);
  const isNew = useSelector((state: RootState) => state.notification.isNew);

  const openExternalOpeningTimesApp = async () => {
    const openingTimeUrl = await getOpeningTimesLink(
      openingTimesNotificationId > 0 ? openingTimesNotificationId : notificationId,
      notification,
      openingTimesId,
      isNew,
      router
    );
    if (openingTimeUrl) {
      // Trim any quotes and check if it's a valid url
      const url = openingTimeUrl.replace(/"/g, "");
      if (url.indexOf("http") === 0) {
        window.open(url, "_blank");
      }
    }
  };

  return (
    <Button variant={buttonVariant} iconRight={<IconLinkExternal aria-hidden />} onClick={openExternalOpeningTimesApp}>
      {i18n.t(buttonTextKey)}
      <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
    </Button>
  );
};

export default OpeningTimesButton;
