import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import { getAccessibilityInfoLink } from "../../utils/save";

interface AccessibilityInfoButtonProps {
  buttonTextKey: string;
  buttonVariant: "primary" | "secondary";
  disabled?: boolean;
  notificationId: number;
  placeId: number;
  openingTimesId: number;
  isNew: boolean;
}

const AccessibilityInfoButton = ({
  buttonTextKey,
  buttonVariant,
  disabled,
  notificationId,
  placeId,
  isNew,
}: AccessibilityInfoButtonProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const openExternalAccessibilityApp = async () => {
    const accessibilityAppUrl = await getAccessibilityInfoLink(notificationId, placeId, isNew, router);
    if (accessibilityAppUrl) {
      // Trim any quotes and check if it's a valid url
      const url = accessibilityAppUrl.replace(/"/g, "");
      if (url.indexOf("http") === 0) {
        window.open(url, "_blank");
      }
    }
  };

  return (
    <Button
      variant={buttonVariant}
      iconRight={<IconLinkExternal aria-hidden />}
      onClick={openExternalAccessibilityApp}
      disabled={disabled || (notificationId <= 0 && placeId <= 0)}
    >
      {i18n.t(buttonTextKey)}
      <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
    </Button>
  );
};

AccessibilityInfoButton.defaultProps = {
  disabled: false,
  closeModal: undefined,
};

export default AccessibilityInfoButton;
