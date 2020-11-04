import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Combobox } from "hds-react";
import { RootState } from "../../state/reducers";

const Tags = (): ReactElement => {
  const i18n = useI18n();

  const tagOptions = ["Ravintola", "Kasvisravintola", "TODO"];

  return (
    <div>
      <h2>{i18n.t("notification.tags.title")}</h2>
      <Combobox
        id="tag"
        options={tagOptions.map((tag) => ({ label: tag }))}
        label={i18n.t("notification.tags.add.label")}
        helper={i18n.t("notification.tags.add.helperText")}
        tooltipLabel={i18n.t("notification.tags.add.tooltipLabel")}
        tooltipText={i18n.t("notification.tags.add.tooltipText")}
        toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
        selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
        clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        required
        multiselect
      />
    </div>
  );
};

export default Tags;
