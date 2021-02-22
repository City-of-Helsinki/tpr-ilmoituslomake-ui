import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextArea } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationTip } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
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
    <div className="formSection">
      <TextArea
        id="userComments"
        className="formInput limitInputWidth"
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
        aria-required
      />

      <TextArea
        id="userDetails"
        className="formInput limitInputWidth"
        rows={3}
        name="user_details"
        value={user_details}
        onChange={updateDetails}
        label={i18n.t("notification.tip.details.label")}
        helperText={i18n.t("notification.tip.details.helperText")}
      />
    </div>
  );
};

export default TipDetails;
