import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea, RadioButton, Combobox } from "hds-react";
import { RootState } from "../../state/reducers";

const Description = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  const tagOptions = ["Ravintola", "Kasvisravintola", "TODO"];

  return (
    <div>
      <h1>{`${currentPage} ${i18n.t("notification.description.title")}`}</h1>

      <h2>{i18n.t("notification.description.placeType.title")}</h2>
      <div role="group" aria-labelledby="myPlace">
        <div id="myPlace">
          {i18n.t("notification.description.placeType.myPlace")}
          <span aria-hidden="true" className="hds-text-input__required">
            *
          </span>
        </div>
        <RadioButton id="placeType_private" value="private" label={i18n.t("notification.description.placeType.private")} />
        <RadioButton id="placeType_municipal" value="municipal" label={i18n.t("notification.description.placeType.municipal")} />
        <RadioButton id="placeType_institution" value="institution" label={i18n.t("notification.description.placeType.institution")} />
      </div>

      <h2>{i18n.t("notification.description.information.title")}</h2>
      <TextInput id="placeName" label={i18n.t("notification.description.placeName.title")} required />
      <TextArea
        id="shortDescription"
        label={i18n.t("notification.description.shortDescription.title")}
        helperText={i18n.t("notification.description.shortDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.shortDescription.tooltipText")}
        required
      />
      <TextArea
        id="longDescription"
        label={i18n.t("notification.description.longDescription.title")}
        helperText={i18n.t("notification.description.longDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.longDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.longDescription.tooltipText")}
      />

      <h2>{i18n.t("notification.description.tag.title")}</h2>
      <Combobox
        options={tagOptions.map((tag) => ({ label: tag }))}
        label={i18n.t("notification.description.tag.add")}
        helper={i18n.t("notification.description.tag.helperText")}
        tooltipLabel={i18n.t("notification.description.tag.tooltipLabel")}
        tooltipText={i18n.t("notification.description.tag.tooltipText")}
        toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
        selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
        clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        required
        multiselect
      />
    </div>
  );
};

export default Description;
