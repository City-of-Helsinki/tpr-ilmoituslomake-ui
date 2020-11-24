import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Navigation } from "hds-react";
import Header from "../common/Header";
import { ModerationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import styles from "./ModerationHeader.module.scss";

const ModerationHeader = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();

  const currentPage = useSelector((state: RootState) => state.moderation.page);

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  return (
    <Header>
      <Navigation.Row variant="inline">
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("moderation.page.front")}`}
          active={currentPage === 1}
          onClick={() => changePage(1)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("moderation.page.place")}`}
          active={currentPage === 2}
          onClick={() => changePage(2)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("moderation.page.request")}`}
          active={currentPage === 3}
          onClick={() => changePage(3)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("moderation.page.organisation")}`}
          active={currentPage === 4}
          onClick={() => changePage(4)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          label={`${i18n.t("moderation.page.translation")}`}
          active={currentPage === 5}
          onClick={() => changePage(5)}
        />
      </Navigation.Row>
    </Header>
  );
};

export default ModerationHeader;
