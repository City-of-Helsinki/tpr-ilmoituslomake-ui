import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Opening = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  return (
    <div>
      <h1>{`${currentPage} ${i18n.t("notification.opening.title")}`}</h1>
      <div>OPENING TIMES</div>
      <div>PAYMENT METHODS</div>
    </div>
  );
};

export default Opening;
