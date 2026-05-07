import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Header as HdsHeader,  
  IconSearch, IconUser, 
  IconSignin, 
  IconSignout, 
  LoginProvider, 
  LoginProviderProps, 
  Button, 
  ButtonVariant,
  LoginButton, 
  Logo, 
  logoFi, 
  logoSv, 
  logoSvDark, 
  WithoutAuthenticatedUser, 
  WithAuthenticatedUser } from "hds-react";
import { defaultLocale } from "../../utils/i18n";
import { RootState } from "../../state/reducers";
import getOrigin from "../../utils/request";
import { string } from "yup";

interface HeaderProps {
  includeLanguageSelector?: boolean;
  homePagePath?: string;
  children?: React.ReactNode;
}

// NOTE: The HDS Navigation component does not currently work for mobile views when server-side rendering
// A workaround for this is to only use the Navigation component on the client-side
// @ts-ignore: A dynamic import must be used to force client-side rendering regardless of the typescript errors
//const DynamicNavigation = dynamic(() => import("hds-react").then((hds) => hds.Navigation), { ssr: false });
const DynamicHeader = dynamic(() => import("hds-react").then((hds) => hds.Header), { ssr: false });

const Header = ({ includeLanguageSelector, homePagePath, children }: HeaderProps): ReactElement => {
  

  const i18n = useI18n();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);

  const initials = currentUser ? (currentUser?.first_name.charAt(0) + currentUser?.last_name.charAt(0)) : "";

  const [lang, setLang] = React.useState('fi');

  const changeLanguage = (locale: string) => {
    // Use the shallow option to avoid a server-side render in order to preserve the state
    router.push(router.pathname, router.asPath, { locale, shallow: true });
  };

  const logoSrcFromLanguage = () => {
    if (router.locale == "sv") {
      return logoSv;
    } else {
      return logoFi;
    }
  }

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
    <DynamicHeader
      // @ts-ignore: The HDS Navigation component comes from a dynamic import, see above for details
      aria-label={i18n.t("common.header.openMenu")}
      
    >
      <HdsHeader.SkipLink 
        skipTo="#content"
        label={i18n.t("common.header.skipToContent")}></HdsHeader.SkipLink>
      
      <HdsHeader.ActionBar
        logo={<Logo src={logoSrcFromLanguage()} alt={i18n.t("common.header.title")} />}
        logoHref={`${router.basePath}${homePagePath}/`}
        title={i18n.t("common.header.title")}
        titleAriaLabel={i18n.t("common.header.titleAlt")}
        titleHref={`${router.basePath}${homePagePath}/`}
        aria-label={i18n.t("common.header.openMenu")}
        frontPageLabel=""
      >
        
        
        {!currentUser?.authenticated && (
          <Button
            className="fixedRightPosition fit-content"
            iconStart={<IconSignin aria-hidden />}
            onClick={signIn}
            
            variant={ButtonVariant.Supplementary}
          >
            {i18n.t("common.header.login")}
          </Button>
        )}
                

        {currentUser?.authenticated && (
          <HdsHeader.ActionBarItem
            fixedRightPosition
            id="user"
            aria-label={i18n.t("common.header.userInfo")}
            avatar={initials}
            icon={<IconUser />}
            label={i18n.t("common.header.userInfo") + ` (${currentUser?.first_name || currentUser?.email})`}

          >
            <HdsHeader.ActionBarSubItem
              href="#"
              iconEnd={<IconSignout aria-hidden />}
              label={i18n.t("common.header.logout")}
              onClick={signOut}
            />
          </HdsHeader.ActionBarItem>
        )}

        {includeLanguageSelector && (
          <HdsHeader.LanguageSelector
            label={(router.locale || defaultLocale).toUpperCase()}
            aria-label={i18n.t("common.header.selectLanguage")}
          >
            <HdsHeader.ActionBarSubItem href="#" lang="fi" label="Suomeksi" onClick={() => changeLanguage("fi")} />
            <HdsHeader.ActionBarSubItem href="#" lang="sv" label="På svenska" onClick={() => changeLanguage("sv")} />
            <HdsHeader.ActionBarSubItem href="#" lang="en" label="In English" onClick={() => changeLanguage("en")} />
          </HdsHeader.LanguageSelector>
        )}
      </HdsHeader.ActionBar>
        {children}
    </DynamicHeader>
  );
};

Header.defaultProps = {
  includeLanguageSelector: true,
  homePagePath: "",
  children: [],
};

export default Header;
