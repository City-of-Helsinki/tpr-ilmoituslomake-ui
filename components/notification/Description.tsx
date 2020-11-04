import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { RootState } from "../../state/reducers";

const Description = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <h2>{i18n.t("notification.description.title")}</h2>
      <TextInput id="placeName" label={i18n.t("notification.description.placeName.label")} required />
      <TextArea
        id="shortDescription"
        label={i18n.t("notification.description.shortDescription.label")}
        helperText={i18n.t("notification.description.shortDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.shortDescription.tooltipText")}
        required
      />
      <TextArea
        id="longDescription"
        label={i18n.t("notification.description.longDescription.label")}
        helperText={i18n.t("notification.description.longDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.longDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.longDescription.tooltipText")}
      />
    </div>
  );
};

export default Description;
