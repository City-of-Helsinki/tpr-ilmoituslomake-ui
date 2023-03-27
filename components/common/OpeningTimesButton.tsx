import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import { getOpeningTimesLink } from "../../utils/save";

interface OpeningTimesButtonProps {
  buttonTextKey: string;
  buttonVariant: "primary" | "secondary";
  disabled?: boolean;
  closeModal?: () => void;
  notificationId: number;
  placeId: number;
  openingTimesId: number;
  isNew: boolean;
}

const OpeningTimesButton = ({
  buttonTextKey,
  buttonVariant,
  disabled,
  closeModal,
  notificationId,
  placeId,
  openingTimesId,
  isNew,
}: OpeningTimesButtonProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const openExternalOpeningTimesApp = async () => {
    const openingTimeUrl = await getOpeningTimesLink(notificationId, placeId, openingTimesId, isNew, router);
    if (openingTimeUrl) {
      // Trim any quotes and check if it's a valid url
      const url = openingTimeUrl.replace(/"/g, "");
      if (url.indexOf("http") === 0) {
        window.open(url, "_blank");
      }

      if (closeModal) {
        closeModal();
      }
    }
  };

  return (
    <Button
      variant={buttonVariant}
      iconRight={<IconLinkExternal aria-hidden />}
      onClick={openExternalOpeningTimesApp}
      disabled={disabled || (notificationId <= 0 && placeId <= 0)}
    >
      {i18n.t(buttonTextKey)}
      <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
    </Button>
  );
};

OpeningTimesButton.defaultProps = {
  disabled: false,
  closeModal: undefined,
};

export default OpeningTimesButton;
