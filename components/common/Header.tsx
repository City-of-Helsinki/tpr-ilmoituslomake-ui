import React, { Dispatch, ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Navigation, IconSignout } from "hds-react";
import { defaultLocale } from "../../utils/i18n";
import { NotificationAction } from "../../state/actions/types";
import { setUser } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";


interface HeaderProps {
  children?: React.ReactNode;
}

const Header = (props: HeaderProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.notification.user);

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

    window.open(`${protocol}//${hostname}/helauth/login/?next=${pathname}`, "_self");
  };

  const signOut = async () => {
    const {
      location: { protocol, hostname, pathname },
    } = window;

    // TODO: Improve logout: remove cookies?
    await fetch("/api/user/logout/");
    window.open("https://api.hel.fi/sso/openid/end-session/", "_self");
  };

  return (
    <div>
      <Navigation
        title={i18n.t("notification.title")}
        menuToggleAriaLabel="menu"
        skipTo="#content"
        skipToContentLabel={i18n.t("notification.skipToContent")}
      >
        {props.children}
        <Navigation.Actions>
          <Navigation.User
            label={i18n.t("notification.login")}
            authenticated={currentUser?.authenticated}
            userName={currentUser?.first_name || currentUser?.email}
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
            <Navigation.Item label="På svenska" onClick={() => changeLanguage("sv")} />
            <Navigation.Item label="In English" onClick={() => changeLanguage("en")} />
          </Navigation.LanguageSelector>
        </Navigation.Actions>
      </Navigation>
    </div>
  );
};

export default Header;
