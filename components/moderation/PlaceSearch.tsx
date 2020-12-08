import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, Checkbox, Combobox, Select, TextInput } from "hds-react";
import { ModerationAction } from "../../state/actions/types";
import { setModerationPlaceSearch, clearModerationPlaceSearch } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { OptionType } from "../../types/general";
import styles from "./PlaceSearch.module.scss";

type OptionTypeWithoutId = {
  label: string;
};

const PlaceSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();

  const placeSearch = useSelector((state: RootState) => state.moderation.placeSearch);
  const { placeName, language, address, district, tag, comment, publishPermission } = placeSearch;

  const languageOptions = [
    { id: "fi", label: i18n.t("moderation.placeSearch.language.fi") },
    { id: "sv", label: i18n.t("moderation.placeSearch.language.sv") },
    { id: "en", label: i18n.t("moderation.placeSearch.language.en") },
  ];
  const districtOptions = [{ label: "Test" }];
  const tagOptions = [{ label: "Test" }];
  const publishPermissionOptions = ["yes", "no"];

  const convertValue = (value: string | undefined): OptionTypeWithoutId | undefined => ({ label: value ?? "" });
  const convertValueWithId = (value: string | undefined): OptionType | undefined => languageOptions.find((l) => l.id === value);

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationPlaceSearch({ ...placeSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchLanguage = (selected: OptionType) => {
    dispatch(setModerationPlaceSearch({ ...placeSearch, language: selected ? (selected.id as string) : "" }));
  };

  const updateSearchDistrict = (selected: OptionTypeWithoutId) => {
    dispatch(setModerationPlaceSearch({ ...placeSearch, district: selected ? selected.label : "" }));
  };

  const updateSearchTag = (selected: OptionTypeWithoutId) => {
    dispatch(setModerationPlaceSearch({ ...placeSearch, tag: selected ? selected.label : "" }));
  };

  const updatePublishPermission = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setModerationPlaceSearch({
        ...placeSearch,
        publishPermission: [...publishPermission.filter((o) => o !== evt.target.value), ...(evt.target.checked ? [evt.target.value] : [])],
      })
    );
  };

  const isChecked = (option: string) => publishPermission.some((o) => o === option);

  const searchPlaces = () => {
    console.log("TODO");
  };

  const clearPlaceSearch = () => {
    dispatch(clearModerationPlaceSearch());
  };

  return (
    <div className={styles.placeSearch}>
      <h3>{i18n.t("moderation.placeSearch.title")}</h3>

      <div className="gridLayoutContainer">
        <TextInput
          id="placeName"
          className="gridColumn1"
          label={i18n.t("moderation.placeSearch.placeName.label")}
          name="placeName"
          value={placeName}
          onChange={updateSearchText}
        />
        <Select
          id="language"
          className="gridColumn2"
          options={languageOptions}
          defaultValue={convertValueWithId(language)}
          onChange={updateSearchLanguage}
          label={i18n.t("moderation.placeSearch.language.label")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        />
        <div role="group" className="gridColumn3" aria-labelledby="payment">
          <div id="payment">{i18n.t("moderation.placeSearch.publishPermission.label")}</div>
          {publishPermissionOptions.map((option) => (
            <Checkbox
              id={option}
              key={option}
              label={i18n.t(`moderation.placeSearch.publishPermission.${option}`)}
              value={option}
              checked={isChecked(option)}
              onChange={updatePublishPermission}
            />
          ))}
        </div>
        <TextInput
          id="address"
          className="gridColumn1"
          label={i18n.t("moderation.placeSearch.address.label")}
          name="address"
          value={address}
          onChange={updateSearchText}
        />
        <Combobox
          id="district"
          className="gridColumn2"
          options={districtOptions}
          defaultValue={convertValue(district)}
          onChange={updateSearchDistrict}
          label={i18n.t("moderation.placeSearch.district.label")}
          toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        />
        <Combobox
          id="tag"
          className="gridColumn1"
          options={tagOptions}
          defaultValue={convertValue(tag)}
          onChange={updateSearchTag}
          label={i18n.t("moderation.placeSearch.tag.label")}
          toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        />
        <TextInput
          id="comment"
          className="gridColumn1"
          label={i18n.t("moderation.placeSearch.comment.label")}
          name="comment"
          value={comment}
          onChange={updateSearchText}
        />
        <div className="gridColumn1">
          <Button onClick={searchPlaces}>{i18n.t("moderation.button.search")}</Button>
          <Button variant="secondary" onClick={clearPlaceSearch}>
            {i18n.t("moderation.button.clear")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceSearch;
