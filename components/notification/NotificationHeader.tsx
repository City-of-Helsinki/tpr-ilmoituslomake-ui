import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Navigation } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

import Header from "../common/Header";

import styles from "./NotificationHeader.module.scss";

const NotificationHeader = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  return (
    <Header>
      <Navigation.Row>
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("notification.page.basic")}`}
          active={currentPage === 1}
          onClick={() => changePage(1)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("notification.page.contact")}`}
          active={currentPage === 2}
          onClick={() => changePage(2)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("notification.page.photos")}`}
          active={currentPage === 3}
          onClick={() => changePage(3)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("notification.page.payment")}`}
          active={currentPage === 4}
          onClick={() => changePage(4)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("notification.page.send")}`}
          active={currentPage === 5}
          onClick={() => changePage(5)}
        />
      </Navigation.Row>
    </Header>
  );
};

export default NotificationHeader;
