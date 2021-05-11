import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPlus, Koros } from "hds-react";
import { RootState } from "../../state/reducers";
import { ItemType, Toast } from "../../types/constants";
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
        <h1 className="moderation">{i18n.t("moderation.intro.title")}</h1>
        <div className="formInput">{i18n.t("common.todo")}</div>
        <Link href="/moderation/place">
          <Button className={styles.primary}>{i18n.t("moderation.button.allPlaces")}</Button>
        </Link>
        <Button className={styles.primary} iconLeft={<IconPlus aria-hidden />} onClick={makeNewPlaceChangeRequest}>
          {i18n.t("moderation.button.addNewPlace")}
        </Button>
      </div>
      <Koros className={styles.wave} type="basic" flipHorizontal />

      {toast && <ToastNotification prefix="moderation" toast={toast} setToast={setToast} />}
    </div>
  );
};

export default Intro;
