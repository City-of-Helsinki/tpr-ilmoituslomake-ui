import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";

const Photos = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  return (
    <div>
      <h1>{`${currentPage} ${i18n.t("notification.photos.title")}`}</h1>
    </div>
  );
};

export default Photos;
