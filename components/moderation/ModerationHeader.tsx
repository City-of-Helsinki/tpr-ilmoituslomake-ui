import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";
import { Navigation } from "hds-react";
import Header from "../common/Header";
import styles from "./ModerationHeader.module.scss";

interface ModerationHeaderProps {
  currentPage: number;
}

const ModerationHeader = (props: ModerationHeaderProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const { currentPage } = props;

  const changePage = (pageNumber: number) => {
    switch (pageNumber) {
      case 1: {
        router.push("/moderation/front");
        break;
      }
      case 2: {
        router.push("/moderation/place");
        break;
      }
      case 3: {
        router.push("/moderation/task");
        break;
      }
      /*
      case 4: {
        router.push("/moderation/organisation");
        break;
      }
      case 5: {
        router.push("/moderation/translation");
        break;
      }
      */
      default: {
        // Nothing to do
      }
    }
  };

  return (
    <Header includeLanguageSelector={false}>
      <Navigation.Row variant="inline">
        <Navigation.Item
          className={styles.navigationItem}
          href="#"
          label={`${i18n.t("moderation.page.front")}`}
          active={currentPage === 1}
          onClick={() => changePage(1)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          href="#"
          label={`${i18n.t("moderation.page.place")}`}
          active={currentPage === 2}
          onClick={() => changePage(2)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          href="#"
          label={`${i18n.t("moderation.page.task")}`}
          active={currentPage === 3}
          onClick={() => changePage(3)}
        />
        {/*
        <Navigation.Item
          className={styles.navigationItem}
          href="#"
          label={`${i18n.t("moderation.page.organisation")}`}
          active={currentPage === 4}
          onClick={() => changePage(4)}
        />
        <Navigation.Item
          className={styles.navigationItem}
          href="#"
          label={`${i18n.t("moderation.page.translation")}`}
          active={currentPage === 5}
          onClick={() => changePage(5)}
        />
        */}
      </Navigation.Row>
    </Header>
  );
};

export default ModerationHeader;
