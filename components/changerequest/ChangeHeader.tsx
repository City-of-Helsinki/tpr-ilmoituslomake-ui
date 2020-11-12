import React, { Dispatch, ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Navigation, IconSignout } from "hds-react";
import { defaultLocale } from "../../utils/i18n";
import { NotificationAction } from "../../state/actions/types";
import { setPage, setUser } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import styles from "./Header.module.scss";

const ChangeHeader = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const currentUser = useSelector((state: RootState) => state.notification.user);

  const changePage = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.pathname, { locale });
  };

  useEffect(() => {
    const getUser = async () => {
      const userResponse = await fetch("/api/user/?format=json");

      if (userResponse.ok) {
        const user = await userResponse.json();

        if (currentUser === undefined || user.username !== currentUser.username) {
          dispatch(setUser({ authenticated: true, ...user }));
        }
      }
    };
    getUser();
  }, [dispatch, currentUser]);

  const signIn = () => {
    const {
      location: { protocol, hostname, pathname },
    } = window;

    window.open(`${protocol}//${hostname}/admin/login/?next=${pathname}`, "_self");
  };

  const signOut = () => {
    const {
      location: { protocol, hostname, pathname },
    } = window;

    window.open(`${protocol}//${hostname}/admin/logout/?next=${pathname}`, "_self");
  };

  return (
    <div className={styles.notificationHeader}>
      <Navigation
        title={i18n.t("notification.title")}
        menuToggleAriaLabel="menu"
        skipTo="#content"
        skipToContentLabel={i18n.t("notification.skipToContent")}
      >
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
        <Navigation.Actions>
          <Navigation.User
            label={i18n.t("notification.login")}
            authenticated={currentUser?.authenticated}
            userName={currentUser?.email}
            onSignIn={signIn}
          >
            <Navigation.Item
              as="a"
              href="#"
              variant="supplementary"
              icon={<IconSignout aria-hidden />}
              label={i18n.t("notification.logout")}
              onClick={signOut}
            />
          </Navigation.User>
          <Navigation.LanguageSelector label={(router.locale || defaultLocale).toUpperCase()}>
            <Navigation.Item label="Suomeksi" onClick={() => changeLanguage("fi")} />
            <Navigation.Item label="In English" onClick={() => changeLanguage("en")} />
          </Navigation.LanguageSelector>
        </Navigation.Actions>
      </Navigation>
    </div>
  );
};

export default ChangeHeader;
