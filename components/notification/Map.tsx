import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Map = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.map.title")}</h2>
      <div>MAP TODO</div>
    </div>
  );
};

export default Map;
