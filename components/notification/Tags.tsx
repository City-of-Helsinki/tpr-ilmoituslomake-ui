import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Combobox } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

type OptionType = {
  label: string;
};

const Tags = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { ontology_ids } = notification;

  const tagOptions = ["Ravintola", "Kasvisravintola", "TODO"];

  const convertOptions = (options: string[]) => {
    return options.map((tag) => ({ label: tag }));
  };

  const updateTags = (selected: OptionType[]) => {
    const newNotification = {
      ...notification,
      ontology_ids: selected.map((s) => s.label),
    };
    dispatch(setNotificationData(newNotification));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.tags.title")}</h2>
      <Combobox
        id="tag"
        className="formInput"
        // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
        options={convertOptions(tagOptions)}
        value={convertOptions(ontology_ids)}
        onChange={updateTags}
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
