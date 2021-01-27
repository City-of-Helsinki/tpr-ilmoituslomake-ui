import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup, TextArea } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationTip } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { ItemType } from "../../types/constants";
import { isTipFieldValid } from "../../utils/validation";

const TipDetails = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { item_type, user_comments, user_details } = tip;

  const tipValidation = useSelector((state: RootState) => state.notificationValidation.tipValidation);
  const { item_type: itemTypeValid, user_comments: userCommentsValid, user_details: userDetailsValid } = tipValidation;

  const updateItemType = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationTip({ ...tip, item_type: evt.target.value as ItemType }));
  };

  const updateDetails = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationTip({ ...tip, [evt.target.name]: evt.target.value }));
  };

  const validateDetails = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    isTipFieldValid(evt.target.name, tip, dispatchValidation);
  };

  return (
    <div className="formSection">
      <SelectionGroup
        id="itemType"
        direction="horizontal"
        className="formInput"
        label={i18n.t("notification.tip.itemType.label")}
        errorText={
          !itemTypeValid.valid ? i18n.t(itemTypeValid.message as string).replace("$fieldName", i18n.t("notification.tip.itemType.label")) : ""
        }
        required
      >
        <RadioButton
          id="itemType_change"
          label={i18n.t("notification.tip.itemType.change")}
          name="item_type"
          value={ItemType.ChangeRequestChange}
          checked={item_type === ItemType.ChangeRequestChange}
          onChange={updateItemType}
        />
        <RadioButton
          id="itemType_delete"
          label={i18n.t("notification.tip.itemType.delete")}
          name="item_type"
          value={ItemType.ChangeRequestDelete}
          checked={item_type === ItemType.ChangeRequestDelete}
          onChange={updateItemType}
        />
      </SelectionGroup>

      <TextArea
        id="userComments"
        className="formInput"
        rows={3}
        name="user_comments"
        value={user_comments}
        onChange={updateDetails}
        onBlur={validateDetails}
        label={i18n.t("notification.tip.comments.label")}
        helperText={i18n.t("notification.tip.comments.helperText")}
        invalid={!userCommentsValid.valid}
        errorText={
          !userCommentsValid.valid ? i18n.t(userCommentsValid.message as string).replace("$fieldName", i18n.t("notification.tip.comments.label")) : ""
        }
        required
      />

      <TextArea
        id="userDetails"
        className="formInput"
        rows={3}
        name="user_details"
        value={user_details}
        onChange={updateDetails}
        onBlur={validateDetails}
        label={i18n.t("notification.tip.details.label")}
        helperText={i18n.t("notification.tip.details.helperText")}
        invalid={!userDetailsValid.valid}
        errorText={
          !userDetailsValid.valid ? i18n.t(userDetailsValid.message as string).replace("$fieldName", i18n.t("notification.tip.details.label")) : ""
        }
        required
      />
    </div>
  );
};

export default TipDetails;
