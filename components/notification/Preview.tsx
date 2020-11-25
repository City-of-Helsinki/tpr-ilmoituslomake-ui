import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Preview = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.preview.title")}</h3>
      <div>PREVIEW TODO</div>
    </div>
  );
};

export default Preview;
