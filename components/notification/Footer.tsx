import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Footer = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  const previousPage = () => {
    dispatch(setPage(currentPage - 1));
  };

  const nextPage = () => {
    dispatch(setPage(currentPage + 1));
  };

  return (
    <div>
      <Button variant="secondary" onClick={previousPage}>
        {i18n.t("notification.button.previous")}
      </Button>
      <Button onClick={nextPage}>{i18n.t("notification.button.next")}</Button>
    </div>
  );
};

export default Footer;
