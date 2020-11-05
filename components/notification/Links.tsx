import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { RootState } from "../../state/reducers";

const Links = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.links.title")}</h2>
      <TextInput id="website" className="formInput" label={i18n.t("notification.links.website.label")} />
      <TextInput id="socialMedia" className="formInput" label={i18n.t("notification.links.socialMedia.label")} />
    </div>
  );
};

export default Links;
