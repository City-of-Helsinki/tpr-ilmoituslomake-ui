import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextArea } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationPrice } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS } from "../../types/constants";

const Prices = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { price } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages } = notificationExtra;

  const updatePrice = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationPrice({ [evt.target.name]: evt.target.value }));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.prices.title")}</h2>
      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.prices.price.label")}</h3>}
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) ? (
            <TextArea
              id={`price_${option}`}
              key={`price_${option}`}
              className="formInput"
              rows={6}
              label={`${i18n.t("notification.prices.price.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
              name={option}
              value={price[option] as string}
              onChange={updatePrice}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Prices;
