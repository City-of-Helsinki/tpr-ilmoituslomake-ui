import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Payment = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <h2>{i18n.t("notification.payment.title")}</h2>
      <div>PAYMENT TODO</div>
    </div>
  );
};

export default Payment;
