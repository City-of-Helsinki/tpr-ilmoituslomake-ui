import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { languageOptions } from "./InputLanguage";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationLink } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Links = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { website } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages } = notificationExtra;

  const updateWebsite = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationLink({ [evt.target.name]: evt.target.value }));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.links.title")}</h2>
      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.links.website.label")}</h3>}
        {languageOptions.map((option) =>
          inputLanguages.includes(option) ? (
            <TextInput
              id={`website_${option}`}
              key={`website_${option}`}
              className="formInput"
              label={`${i18n.t("notification.links.website.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              name={option}
              value={website[option] as string}
              onChange={updateWebsite}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Links;
