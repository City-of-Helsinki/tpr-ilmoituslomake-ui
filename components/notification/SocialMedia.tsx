import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconPlus, TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { removeNotificationSocialMedia, setNotificationSocialMedia } from "../../state/actions/notification";
import { removeNotificationSocialMediaValidation, setNotificationSocialMediaValidation } from "../../state/actions/notificationValidation";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH_URL } from "../../types/constants";
import { SocialMediaValidation } from "../../types/notification_validation";
import { isSocialMediaFieldValid } from "../../utils/validation";
import styles from "./SocialMedia.module.scss";

const SocialMedia = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { social_media = [] } = notification;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { social_media: socialMediaValid } = notificationValidation;

  const updateSocialMedia = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationSocialMedia(index, { ...social_media[index], [evt.target.name]: evt.target.value }));
  };

  const addSocialMediaItem = () => {
    dispatch(
      setNotificationSocialMedia(-1, {
        title: "",
        link: "",
        new: true,
      })
    );
    dispatchValidation(
      setNotificationSocialMediaValidation(-1, {
        title: { valid: true },
        link: { valid: true },
      } as SocialMediaValidation)
    );
  };

  const removeSocialMediaItem = (index: number) => {
    dispatch(removeNotificationSocialMedia(index));
    dispatchValidation(removeNotificationSocialMediaValidation(index));
  };

  const validateSocialMedia = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setNotificationSocialMedia(index, { ...social_media[index], [evt.target.name]: (social_media[index][evt.target.name] as string).trim() })
    );
    isSocialMediaFieldValid(index, evt.target.name, notification, dispatchValidation);
  };

  return (
    <div className={`formSection ${styles.socialMedia}`}>
      <h3>{i18n.t("notification.socialMedia.heading")}</h3>
      {social_media.map(({ title, link }, index) => {
        const key = `socialmedia_${index}`;
        return (
          <div key={key}>
            <TextInput
              id={`title_${index}`}
              className="formInput"
              label={i18n.t("notification.socialMedia.title.label")}
              name="title"
              value={title}
              maxLength={MAX_LENGTH_URL}
              onChange={(evt) => updateSocialMedia(index, evt)}
              onBlur={(evt) => validateSocialMedia(index, evt)}
              invalid={!socialMediaValid[index].title.valid}
              errorText={
                !socialMediaValid[index].title.valid
                  ? i18n.t(socialMediaValid[index].title.message as string).replace("$fieldName", i18n.t("notification.socialMedia.title.label"))
                  : ""
              }
              tooltipButtonLabel={i18n.t("notification.button.openHelp")}
              tooltipLabel={i18n.t("notification.socialMedia.title.tooltipLabel")}
              tooltipText={i18n.t("notification.socialMedia.title.tooltipText")}
              required
              aria-required
            />
            <TextInput
              id={`link_${index}`}
              className="formInput"
              label={i18n.t("notification.socialMedia.link.label")}
              name="link"
              value={link}
              maxLength={MAX_LENGTH_URL}
              onChange={(evt) => updateSocialMedia(index, evt)}
              onBlur={(evt) => validateSocialMedia(index, evt)}
              invalid={!socialMediaValid[index].link.valid}
              errorText={
                !socialMediaValid[index].link.valid
                  ? i18n.t(socialMediaValid[index].link.message as string).replace("$fieldName", i18n.t("notification.socialMedia.link.label"))
                  : ""
              }
              tooltipButtonLabel={i18n.t("notification.button.openHelp")}
              tooltipLabel={i18n.t("notification.socialMedia.link.tooltipLabel")}
              tooltipText={i18n.t("notification.socialMedia.link.tooltipText")}
              required
              aria-required
            />
            <Button variant="secondary" className="formInput" onClick={() => removeSocialMediaItem(index)}>
              {i18n.t("notification.socialMedia.remove")}
            </Button>
            <hr />
          </div>
        );
      })}

      <div>
        <Button variant="secondary" iconLeft={<IconPlus aria-hidden />} onClick={() => addSocialMediaItem()}>
          {i18n.t("notification.socialMedia.addNew")}
        </Button>
      </div>
    </div>
  );
};

export default SocialMedia;
