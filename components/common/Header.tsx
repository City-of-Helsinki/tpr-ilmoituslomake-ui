import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Navigation, IconSignout } from "hds-react";
import { defaultLocale } from "../../utils/i18n";
import { RootState } from "../../state/reducers";
import getOrigin from "../../utils/request";

interface HeaderProps {
  children?: React.ReactNode;
}

const defaultProps: HeaderProps = {
  children: [],
};

const Header = ({ children }: HeaderProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);

  const changeLanguage = (locale: string) => {
    // Use the shallow option to avoid a server-side render in order to preserve the state
    router.push(router.pathname, router.asPath, { locale, shallow: true });
  };

  const signIn = () => {
    const {
      location: { pathname },
    } = window;

    window.open(`${getOrigin(router)}/helauth/login/?next=${pathname}`, "_self");
  };

  const signOut = async () => {
    // TODO: Improve logout: remove cookies?
    await fetch(`${getOrigin(router)}/api/user/logout`);
    window.open("https://api.hel.fi/sso/openid/end-session/", "_self");
  };

  return (
    <Navigation title={i18n.t("header.title")} menuToggleAriaLabel="menu" skipTo="#content" skipToContentLabel={i18n.t("header.skipToContent")}>
      {children}
      <Navigation.Actions>
        <Navigation.User
          label={i18n.t("header.login")}
          authenticated={currentUser?.authenticated}
          userName={currentUser?.first_name || currentUser?.email}
          onSignIn={signIn}
        >
          <Navigation.Item
            as="a"
            href="#"
            variant="supplementary"
            icon={<IconSignout aria-hidden />}
            label={i18n.t("header.logout")}
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
  );
};

Header.defaultProps = defaultProps;
export default Header;
