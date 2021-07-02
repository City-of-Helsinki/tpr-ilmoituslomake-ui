import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextArea } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { setNotificationComments } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH_LONG_DESC } from "../../types/constants";
import styles from "./Comments.module.scss";

const Comments = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { comments } = notification;

  const updateComments = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationComments(evt.target.value));
  };

  const validateComments = () => {
    dispatch(setNotificationComments(comments.trim()));
  };

  return (
    <div className={`formInput ${styles.comments}`}>
      <TextArea
        id="comments"
        className="formInput"
        rows={3}
        label={i18n.t("notification.comments.comments.label")}
        name="comments"
        value={comments}
        maxLength={MAX_LENGTH_LONG_DESC}
        onChange={updateComments}
        onBlur={validateComments}
      />
    </div>
  );
};

export default Comments;
