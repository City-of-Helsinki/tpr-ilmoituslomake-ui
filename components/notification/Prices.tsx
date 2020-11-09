import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextArea } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Prices = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    price: { fi: priceFi },
  } = notification;

  const updatePrice = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const newNotification = { ...notification, price: { ...notification.price, [evt.target.name]: evt.target.value } };
    dispatch(setNotificationData(newNotification));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.prices.title")}</h2>
      <TextArea id="price" className="formInput" label={i18n.t("notification.prices.price.label")} name="fi" value={priceFi} onChange={updatePrice} />
    </div>
  );
};

export default Prices;
