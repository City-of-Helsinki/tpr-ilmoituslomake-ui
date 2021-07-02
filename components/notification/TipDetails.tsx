import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextArea } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationTip } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH_LONG_DESC } from "../../types/constants";
import { isTipFieldValid } from "../../utils/validation";

const TipDetails = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { user_comments, user_details } = tip;

  const tipValidation = useSelector((state: RootState) => state.notificationValidation.tipValidation);
  const { user_comments: userCommentsValid } = tipValidation;

  const updateDetails = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationTip({ ...tip, [evt.target.name]: evt.target.value }));
  };

  const validateDetails = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    isTipFieldValid(evt.target.name, tip, dispatchValidation);
  };

  return (
    <div className="formItem">
      <TextArea
        id="userComments"
        className="formInput"
        rows={3}
        name="user_comments"
        value={user_comments}
        maxLength={MAX_LENGTH_LONG_DESC}
        onChange={updateDetails}
        onBlur={validateDetails}
        label={i18n.t("notification.tip.comments.label")}
        helperText={i18n.t("notification.tip.comments.helperText")}
        invalid={!userCommentsValid.valid}
        errorText={
          !userCommentsValid.valid ? i18n.t(userCommentsValid.message as string).replace("$fieldName", i18n.t("notification.tip.comments.label")) : ""
        }
        required
        aria-required
      />

      <TextArea
        id="userDetails"
        className="formInput"
        rows={3}
        name="user_details"
        value={user_details}
        maxLength={MAX_LENGTH_LONG_DESC}
        onChange={updateDetails}
        label={i18n.t("notification.tip.details.label")}
        helperText={i18n.t("notification.tip.details.helperText")}
      />
    </div>
  );
};

export default TipDetails;
