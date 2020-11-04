import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Prices = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <h2>{i18n.t("notification.prices.title")}</h2>
      <div>PRICES TODO</div>
    </div>
  );
};

export default Prices;
