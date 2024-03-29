import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPlus, Koros, Link as HdsLink } from "hds-react";
import { RootState } from "../../state/reducers";
import { ItemType, MODERATION_GUIDE_URL, Toast } from "../../types/constants";
import { saveModerationChangeRequest } from "../../utils/moderation";
import ToastNotification from "../common/ToastNotification";
import styles from "./Intro.module.scss";

const Intro = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const [toast, setToast] = useState<Toast>();

  const makeNewPlaceChangeRequest = () => {
    // Make a new moderation task for the new place by making a change request
    const newPlaceChangeRequest = {
      target: 0,
      item_type: ItemType.ChangeRequestAdd,
      user_place_name: "",
      user_comments: i18n.t("moderation.taskHeader.moderatorChangeRequest"),
      user_details: currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : "",
    };
    saveModerationChangeRequest(newPlaceChangeRequest, router, setToast);
  };

  return (
    <div className="formSection">
      <div className={styles.intro}>
        <h1 className={`moderation ${styles.title}`}>{i18n.t("moderation.intro.title")}</h1>
        <div className="formInput">
          {i18n.t("moderation.intro.info1")}
          <HdsLink
            href={`${router.basePath}/`}
            size="M"
            openInNewTab
            openInNewTabAriaLabel={i18n.t("common.opensInANewTab")}
            external
            openInExternalDomainAriaLabel={i18n.t("common.opensExternal")}
            disableVisitedStyles
          >
            {i18n.t("moderation.intro.link")}
          </HdsLink>
          {i18n.t("moderation.intro.info2")}
        </div>
        <div className="formInput">{i18n.t("moderation.intro.info3")}</div>
        <div className="formInput">
          <HdsLink
            href={MODERATION_GUIDE_URL}
            size="M"
            openInNewTab
            openInNewTabAriaLabel={i18n.t("common.opensInANewTab")}
            external
            openInExternalDomainAriaLabel={i18n.t("common.opensExternal")}
            disableVisitedStyles
          >
            {i18n.t("moderation.intro.guide")}
          </HdsLink>
        </div>

        {toast && <ToastNotification prefix="moderation" toast={toast} setToast={setToast} />}

        <div className={styles.buttonRow}>
          <div className={styles.flexButton}>
            <Link href="/moderation/place">
              <Button className={styles.primary}>{i18n.t("moderation.button.allPlaces")}</Button>
            </Link>
          </div>
          <div className={styles.flexButton}>
            <Button className={styles.primary} iconLeft={<IconPlus aria-hidden />} onClick={makeNewPlaceChangeRequest}>
              {i18n.t("moderation.button.addNewPlace")}
            </Button>
          </div>
        </div>
      </div>
      <Koros className={styles.wave} type="basic" flipHorizontal />
    </div>
  );
};

export default Intro;
