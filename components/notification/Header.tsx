import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Navigation } from "hds-react";
import { defaultLocale } from "../../utils/i18n";
import { NotificationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Header = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.pathname, { locale });
  };

  return (
    <div>
      <Navigation
        title={i18n.t("notification.title")}
        menuToggleAriaLabel="menu"
        skipTo="#content"
        skipToContentLabel={i18n.t("notification.skipToContent")}
      >
        <Navigation.Row>
          <Navigation.Item label={`1 ${i18n.t("notification.page.description")}`} active={currentPage === 1} onClick={() => changePage(1)} />
          <Navigation.Item label={`2 ${i18n.t("notification.page.contact")}`} active={currentPage === 2} onClick={() => changePage(2)} />
          <Navigation.Item label={`3 ${i18n.t("notification.page.opening")}`} active={currentPage === 3} onClick={() => changePage(3)} />
          <Navigation.Item label={`4 ${i18n.t("notification.page.photos")}`} active={currentPage === 4} onClick={() => changePage(4)} />
          <Navigation.Item label={`5 ${i18n.t("notification.page.notifier")}`} active={currentPage === 5} onClick={() => changePage(5)} />
        </Navigation.Row>
        <Navigation.Actions>
          <Navigation.User label={i18n.t("notification.login")} />
          <Navigation.LanguageSelector label={(router.locale || defaultLocale).toUpperCase()}>
            <Navigation.Item label="Suomeksi" onClick={() => changeLanguage("fi")} />
            <Navigation.Item label="In English" onClick={() => changeLanguage("en")} />
          </Navigation.LanguageSelector>
        </Navigation.Actions>
      </Navigation>
    </div>
  );
};

export default Header;
