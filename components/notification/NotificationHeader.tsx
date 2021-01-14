import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Koros, Navigation } from "hds-react";
import { Stepper, Step, StepLabel, CircularProgress } from "@material-ui/core";
import { StylesProvider } from "@material-ui/core/styles";
import Header from "../common/Header";
import { NotificationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_PAGE } from "../../types/constants";
import styles from "./NotificationHeader.module.scss";

const NotificationHeader = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notificationName = useSelector((state: RootState) => state.notification.notificationName);

  // The header should only be visible for developer usage
  const devHeader = false;

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  return (
    <>
      <Header>
        {devHeader && (
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
        )}
      </Header>
      <section className={styles.header}>
        <StylesProvider injectFirst>
          <div className={styles.tabletContainer}>
            <h1>{notificationId > 0 ? `${i18n.t("notification.headerModify")}: ${notificationName}` : i18n.t("notification.headerNew")}</h1>
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
          </div>
          <div className={styles.mobileContainer}>
            <div className={styles.mobileHeader}>
              <div className={styles.progressContainer}>
                <div className={styles.progressItem}>
                  <CircularProgress classes={{ root: styles.progress }} variant="determinate" value={(100 * currentPage) / MAX_PAGE} />
                </div>
                <div className={styles.progressItem}>
                  <h3 className={styles.progressText}>{`${currentPage} / ${MAX_PAGE}`}</h3>
                </div>
              </div>
              <div className={styles.mobileHeaderText}>
                {notificationId > 0 ? `${i18n.t("notification.headerModify")}: ${notificationName}` : i18n.t("notification.headerNew")}
              </div>
            </div>
            <Koros className={styles.wave} type="basic" flipHorizontal />
          </div>
        </StylesProvider>
      </section>
    </>
  );
};

export default NotificationHeader;
