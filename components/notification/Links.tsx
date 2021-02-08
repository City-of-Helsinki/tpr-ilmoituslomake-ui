import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationLink } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS } from "../../types/constants";
import { isWebsiteValid } from "../../utils/validation";

const Links = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { website } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { website: websiteValid } = notificationValidation;

  const updateWebsite = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationLink({ [evt.target.name]: evt.target.value }));
  };

  const validateWebsite = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationLink({ [evt.target.name]: (website[evt.target.name] as string).trim() }));
    isWebsiteValid(evt.target.name, notification, dispatchValidation);
  };

  return (
    <div className="formSection">
      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.links.website.label")}</h3>}
        {LANGUAGE_OPTIONS.map((option) => {
          const label = `${i18n.t("notification.links.website.label")} ${i18n.t(`general.inLanguage.${option}`)}`;
          return inputLanguages.includes(option) ? (
            <TextInput
              id={`website_${option}`}
              key={`website_${option}`}
              className="formInput"
              label={label}
              name={option}
              value={website[option] as string}
              onChange={updateWebsite}
              onBlur={validateWebsite}
              tooltipButtonLabel={i18n.t("notification.links.website.tooltipLabel")}
              tooltipLabel={i18n.t("notification.links.website.tooltipLabel")}
              tooltipText={i18n.t("notification.links.website.tooltipText")}
              invalid={!websiteValid[option].valid}
              errorText={!websiteValid[option].valid ? i18n.t(websiteValid[option].message as string).replace("$fieldName", label) : ""}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default Links;
