import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, ButtonVariant, IconLinkExternal } from "hds-react";
import { getOpeningTimesLink } from "../../utils/save";

interface OpeningTimesButtonProps {
  buttonTextKey: string;
  buttonVariant: ButtonVariant.Primary | ButtonVariant.Secondary;
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
      iconEnd={<IconLinkExternal aria-hidden />}
      onClick={openExternalOpeningTimesApp}
      disabled={disabled || (notificationId <= 0 && placeId <= 0)}
      aria-label={i18n.t("common.opensInANewTab")}
    >
      {i18n.t(buttonTextKey)}
    </Button>
  );
};

OpeningTimesButton.defaultProps = {
  disabled: false,
  closeModal: undefined,
};

export default OpeningTimesButton;
