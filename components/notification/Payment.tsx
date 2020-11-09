import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Checkbox } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Payment = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { payment_options } = notification;

  const paymentOptions = ["GlobalBlue", "JCB", "WeChatPay", "AliPay"];

  const updatePayment = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = {
      ...notification,
      payment_options: [
        ...notification.payment_options.filter((o) => o.name !== evt.target.value),
        ...(evt.target.checked ? [{ name: evt.target.value }] : []),
      ],
    };
    dispatch(setNotificationData(newNotification));
  };

  const isChecked = (option: string) => payment_options.some((o) => o.name === option);

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.payment.title")}</h2>
      <div role="group" className="formInput" aria-labelledby="payment">
        <div id="payment">{i18n.t("notification.payment.options")}</div>
        {paymentOptions.map((option) => (
          <Checkbox id={option} key={option} label={option} value={option} checked={isChecked(option)} onChange={updatePayment} />
        ))}
      </div>
    </div>
  );
};

export default Payment;
