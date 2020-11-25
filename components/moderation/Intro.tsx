import React, { Dispatch, ReactElement } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconPlus, IconSearch, Koros } from "hds-react";
import { ModerationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/moderation";
import styles from "./Intro.module.scss";

const Intro = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  return (
    <div className="formSection">
      <div className={styles.intro}>
        <h1>{i18n.t("moderation.intro.title")}</h1>
        <div className="formInput">TEXT HERE</div>
        <Link href="/forms/notification">
          <Button className={styles.primary} iconLeft={<IconPlus />}>
            {i18n.t("moderation.button.addNewPlace")}
          </Button>
        </Link>
        <Button variant="secondary" className={styles.secondary} iconLeft={<IconSearch />} onClick={() => changePage(2)}>
          {i18n.t("moderation.button.searchPlace")}
        </Button>
      </div>
      <Koros className={styles.wave} type="basic" flipHorizontal />
    </div>
  );
};

export default Intro;
