import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Description = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  return (
    <div>
      <h1>{`${currentPage} ${i18n.t("notification.description.title")}`}</h1>
      <div>NAME</div>
      <div>DESCRIPTION</div>
    </div>
  );
};

export default Description;
