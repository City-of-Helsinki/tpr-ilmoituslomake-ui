import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup } from "hds-react";
import { useMediaQuery } from "react-responsive";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationTip } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { ItemType } from "../../types/constants";
import styles from "./TipType.module.scss";

const TipType = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  // Note: this only works for client-side rendering
  const isScreenSizeXS = useMediaQuery({ query: `only screen and (max-width: ${styles.max_breakpoint_xs})` });

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { item_type } = tip;

  const tipValidation = useSelector((state: RootState) => state.notificationValidation.tipValidation);
  const { item_type: itemTypeValid } = tipValidation;

  const updateItemType = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationTip({ ...tip, item_type: evt.target.value as ItemType }));
  };

  return (
    <div className="formItem">
      <SelectionGroup
        id="itemType"
        direction={isScreenSizeXS ? "vertical" : "horizontal"}
        className="formInput"
        label={i18n.t("notification.tip.itemType.label")}
        errorText={
          !itemTypeValid.valid ? i18n.t(itemTypeValid.message as string).replace("$fieldName", i18n.t("notification.tip.itemType.label")) : ""
        }
        required
        aria-required
      >
        <RadioButton
          id="itemType_change"
          label={i18n.t("notification.tip.itemType.change")}
          name="item_type"
          value={ItemType.ChangeRequestChange}
          checked={item_type === ItemType.ChangeRequestChange}
          onChange={updateItemType}
        />
        {/*
        <RadioButton
          id="itemType_add"
          label={i18n.t("notification.tip.itemType.add")}
          name="item_type"
          value={ItemType.ChangeRequestAdd}
          checked={item_type === ItemType.ChangeRequestAdd}
          onChange={updateItemType}
        />
        */}
        <RadioButton
          id="itemType_delete"
          label={i18n.t("notification.tip.itemType.delete")}
          name="item_type"
          value={ItemType.ChangeRequestDelete}
          checked={item_type === ItemType.ChangeRequestDelete}
          onChange={updateItemType}
        />
      </SelectionGroup>
    </div>
  );
};

export default TipType;
