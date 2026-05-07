import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, ButtonVariant, Checkbox,Select, SelectionGroup, TextInput } from "hds-react";
import moment from "moment";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import {
  setModerationTranslationPlaceSearch,
  clearModerationTranslationPlaceSearch,
  setModerationTranslationPlaceResults,
} from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { MatkoTagOption, ModerationPlaceResult, OptionType, TagOption } from "../../../types/general";
import { sortByOptionLabel } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";
import getOrigin from "../../../utils/request";
import styles from "./PlaceSearch.module.scss";

const PlaceSearch = (): ReactElement => {
  const i18n = useI18n();
  //const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const dispatch = useDispatch();
  const router = useRouter();

  const placeSearch = useSelector((state: RootState) => state.moderationTranslation.placeSearch);
  const { placeName, language, address, district, ontologyIds, matkoIds, certificateIds, publishPermission } = placeSearch;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { tagOptions = [], matkoTagOptions = [], certificateOptions = [] } = moderationExtra;

  const languageOptions = [
    { value: "", label: "" },
    { value: "fi", label: i18n.t("moderation.placeSearch.language.fi") },
    { value: "sv", label: i18n.t("moderation.placeSearch.language.sv") },
    { value: "en", label: i18n.t("moderation.placeSearch.language.en") },
  ];
  const publishPermissionOptions = ["yes", "no"];

  const convertValueWithId = (value: string | undefined): OptionType | undefined => languageOptions.find((l) => l.value === value);

  const convertOptions = (options: TagOption[]): OptionType[] =>
    options.map((tag) => ({ value: tag.id, label: tag.ontologyword[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);

  const convertMatkoOptions = (options: MatkoTagOption[]): OptionType[] =>
    options.map((tag) => ({ value: tag.id, label: tag.matkoword[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);

  const convertValues = (values: number[]): OptionType[] => convertOptions(tagOptions.filter((tag) => values.includes(tag.id)));

  const convertMatkoValues = (values: number[]): OptionType[] => convertMatkoOptions(matkoTagOptions.filter((tag) => values.includes(tag.id)));

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTranslationPlaceSearch({ ...placeSearch, [evt.target.name]: evt.target.value }));
  };

  /*
  const updateSearchLanguage = (selected: OptionType) => {
    dispatch(setModerationTranslationPlaceSearch({ ...placeSearch, language: selected ? (selected.value as string) : "" }));
  };*/

  const updateSearchLanguage = (selected: OptionType[]) => {
    dispatch(setModerationTranslationPlaceSearch({ ...placeSearch, language: selected && selected.length > 0 ? (selected[0].value as string) : "" }));
  };

  const updateSearchTags = (selected: OptionType[]) => {
    dispatch(setModerationTranslationPlaceSearch({ ...placeSearch, ontologyIds: selected.map((s) => s.value as number) }));
  };

  const updateSearchMatkoTags = (selected: OptionType[]) => {
    dispatch(setModerationTranslationPlaceSearch({ ...placeSearch, matkoIds: selected.map((s) => s.value as number) }));
  };

  const updateSearchCertificates = (selected: OptionType[]) => {
    dispatch(setModerationTranslationPlaceSearch({ ...placeSearch, certificateIds: selected.map((s) => s.value as number) }));
  };

  const updatePublishPermission = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setModerationTranslationPlaceSearch({
        ...placeSearch,
        publishPermission: evt.target.checked ? evt.target.value : undefined,
      })
    );
  };

  const isChecked = (option: string) => !!publishPermission && publishPermission === option;

  const searchPlaces = async () => {
    const searchObject = {
      ...(placeName.length > 0 && { search_name: placeName.toLowerCase() }),
      ...(address.length > 0 && { search_address__contains: address.toLowerCase() }),
      ...(ontologyIds.length > 0 && { data__ontology_ids__contains: ontologyIds }),
      ...(matkoIds.length > 0 && { data__matko_ids__contains: matkoIds }),
      ...(certificateIds.length > 0 && { data__certificate_ids__contains: certificateIds }),
      ...(publishPermission && { published: publishPermission === "yes" }),
      ...(district.length > 0 && { search_neighborhood: district.toLowerCase() }),
      ...(language.length > 0 && { lang: language }),
    };

    const placeResponse = await fetch(`${getOrigin(router)}/api/moderation/search/?q=${encodeURIComponent(JSON.stringify(searchObject))}`);
    if (placeResponse.ok) {
      const placeResult = await (placeResponse.json() as Promise<{ count: number; next: string; results: ModerationPlaceResult[] }>);

      console.log("PLACE RESPONSE", placeResult);

      if (placeResult && placeResult.results && placeResult.results.length > 0) {
        const { results, count, next } = placeResult;

        // Parse the date strings to date objects
        dispatch(
          setModerationTranslationPlaceResults({
            results: results.map((result) => {
              return {
                ...result,
                updated: moment(result.updated_at).toDate(),
              };
            }),
            count,
            next,
          })
        );
      } else {
        dispatch(setModerationTranslationPlaceResults({ results: [], count: 0 }));
      }
      dispatch(setModerationTranslationPlaceSearch({ ...placeSearch, searchDone: true }));
    }
  };

  const clearPlaceSearch = () => {
    dispatch(clearModerationTranslationPlaceSearch());
  };

  return (
    <div className={`formSection ${styles.placeSearch}`}>
      <div className={styles.header}>
        <h1 className="moderation">{i18n.t("moderation.placeSearch.title")}</h1>
      </div>

      <div className="gridLayoutContainer">
        <TextInput
          id="placeName"
          className={styles.gridColumn1}
          label={i18n.t("moderation.placeSearch.placeName.label")}
          name="placeName"
          value={placeName}
          onChange={updateSearchText}
        />
        <Select
          id="language"
          className={styles.gridColumn2}
          options={[{ label: i18n.t("moderation.placeSearch.language.all"), value: "" }, ...languageOptions]}
          value={convertValueWithId(language)?.toString() || ""}
          onChange={updateSearchLanguage}
          texts={{
            label: i18n.t("moderation.placeSearch.language.label"),
            tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
            tagsClearAllButton: i18n.t("moderation.button.clearAllSelections"),
          }}
        />
        <SelectionGroup
          id="publishPermission"
          direction="horizontal"
          className={styles.gridColumn3}
          label={i18n.t("moderation.placeSearch.publishPermission.label")}
        >
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
        </SelectionGroup>

        <TextInput
          id="address"
          className={styles.gridColumn1}
          label={i18n.t("moderation.placeSearch.address.label")}
          name="address"
          value={address}
          onChange={updateSearchText}
        />
        <TextInput
          id="district"
          className={styles.gridColumn2}
          label={i18n.t("moderation.placeSearch.district.label")}
          name="district"
          value={district}
          onChange={updateSearchText}
        />

        <Select
          id="tag"
          className={styles.gridColumn1}
          // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
          options={convertOptions(tagOptions)}
          value={convertValues(ontologyIds) as any}
          onChange={updateSearchTags}
          label={i18n.t("moderation.placeSearch.tag.label")}
          toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
          multiSelect
        />

        <Select
          id="matkoTag"
          className={styles.gridColumn2}
          // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
          options={convertMatkoOptions(matkoTagOptions)}
          value={convertMatkoValues(matkoIds) as any}
          onChange={updateSearchMatkoTags}
          label={i18n.t("moderation.placeSearch.matko.label")}
          toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
          multiSelect
        />

        <Select
          id="certificate"
          className={styles.gridColumn1}
          // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
          options={convertOptions(certificateOptions)}
          value={convertValues(certificateIds) as any}
          onChange={updateSearchCertificates}
          label={i18n.t("moderation.placeSearch.tag.label")}
          toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
          multiSelect
        />

        <div className={`${styles.gridColumn1} ${styles.searchButtons}`}>
          <div className={styles.flexButton}>
            <Button onClick={searchPlaces}>{i18n.t("moderation.button.search")}</Button>
          </div>
          <div className={styles.flexButton}>
            <Button variant={ButtonVariant.Secondary} onClick={clearPlaceSearch}>
              {i18n.t("moderation.button.clear")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceSearch;
