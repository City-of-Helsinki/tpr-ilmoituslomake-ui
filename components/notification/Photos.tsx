import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Photos = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.photos.title")}</h2>
      <div>PHOTOS TODO</div>
    </div>
  );
};

export default Photos;
