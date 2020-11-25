import React, { Dispatch, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconGroup } from "hds-react";
import { ModerationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/moderation";
import styles from "./OrganisationNotice.module.scss";

const OrganisationNotice = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  return (
    <div>
      <h3>{i18n.t("moderation.organisationNotice.title")}</h3>
      <div className={styles.notice}>
        <IconGroup size="xl" />
        <div className="flexSpace" />
        <div>TEXT HERE</div>
        <div className="flexSpace" />
        <Button variant="secondary" iconLeft={<IconArrowRight />} onClick={() => changePage(4)}>
          {i18n.t("moderation.organisationNotice.manageOrganisation")}
        </Button>
      </div>
    </div>
  );
};

export default OrganisationNotice;
