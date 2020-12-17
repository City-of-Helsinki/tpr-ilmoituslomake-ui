import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Navigation } from "hds-react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { StylesProvider } from "@material-ui/core/styles";
import Header from "../common/Header";
import { NotificationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import styles from "./NotificationHeader.module.scss";

const NotificationHeader = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notificationName = useSelector((state: RootState) => state.notification.notificationName);

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  return (
    <div>
      <Header>
        <Navigation.Row>
          <Navigation.Item
            className={styles.navigationItem}
            label={i18n.t("notification.page.basic")}
            active={currentPage === 1}
            onClick={() => changePage(1)}
          />
          <Navigation.Item
            className={styles.navigationItem}
            label={i18n.t("notification.page.contact")}
            active={currentPage === 2}
            onClick={() => changePage(2)}
          />
          <Navigation.Item
            className={styles.navigationItem}
            label={i18n.t("notification.page.photos")}
            active={currentPage === 3}
            onClick={() => changePage(3)}
          />
          <Navigation.Item
            className={styles.navigationItem}
            label={i18n.t("notification.page.send")}
            active={currentPage === 4}
            onClick={() => changePage(4)}
          />
        </Navigation.Row>
      </Header>
      <div className={styles.header}>
        <h1>{notificationId > 0 ? `${i18n.t("notification.headerModify")}: ${notificationName}` : i18n.t("notification.headerNew")}</h1>
        <StylesProvider injectFirst>
          <Stepper classes={{ root: styles.stepper }} activeStep={currentPage - 1} alternativeLabel>
            <Step>
              <StepLabel>{i18n.t("notification.page.basic")}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{i18n.t("notification.page.contact")}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{i18n.t("notification.page.photos")}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{i18n.t("notification.page.send")}</StepLabel>
            </Step>
          </Stepper>
        </StylesProvider>
      </div>
    </div>
  );
};

export default NotificationHeader;
