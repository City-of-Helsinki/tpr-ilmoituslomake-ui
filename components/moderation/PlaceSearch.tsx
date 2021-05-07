import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Checkbox, Combobox, IconPlus, Select, SelectionGroup, TextInput } from "hds-react";
import moment from "moment";
import { ModerationAction } from "../../state/actions/types";
import { setModerationPlaceSearch, clearModerationPlaceSearch, setModerationPlaceResults } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { ModerationPlaceResult, OptionType, TagOption } from "../../types/general";
import { defaultLocale } from "../../utils/i18n";
import getOrigin from "../../utils/request";
import styles from "./PlaceSearch.module.scss";

const PlaceSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const router = useRouter();

  const placeSearch = useSelector((state: RootState) => state.moderation.placeSearch);
  const { placeName, language, address, district, ontologyIds, comment, publishPermission } = placeSearch;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { tagOptions = [] } = moderationExtra;

  const languageOptions = [
    { id: "", label: "" },
    { id: "fi", label: i18n.t("moderation.placeSearch.language.fi") },
    { id: "sv", label: i18n.t("moderation.placeSearch.language.sv") },
    { id: "en", label: i18n.t("moderation.placeSearch.language.en") },
  ];
  const publishPermissionOptions = ["yes", "no"];

  const convertValueWithId = (value: string | undefined): OptionType | undefined => languageOptions.find((l) => l.id === value);

  const convertOptions = (options: TagOption[]): OptionType[] =>
    options.map((tag) => ({ id: tag.id, label: tag.ontologyword[router.locale || defaultLocale] as string }));

  const convertValues = (values: number[]): OptionType[] => convertOptions(tagOptions.filter((tag) => values.includes(tag.id)));

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationPlaceSearch({ ...placeSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchLanguage = (selected: OptionType) => {
    dispatch(setModerationPlaceSearch({ ...placeSearch, language: selected ? (selected.id as string) : "" }));
  };

  const updateSearchTags = (selected: OptionType[]) => {
    dispatch(setModerationPlaceSearch({ ...placeSearch, ontologyIds: selected.map((s) => s.id as number) }));
  };

  const updatePublishPermission = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setModerationPlaceSearch({
        ...placeSearch,
        publishPermission: evt.target.checked ? evt.target.value : undefined,
      })
    );
  };

  const isChecked = (option: string) => !!publishPermission && publishPermission === option;

  const searchPlaces = async () => {
    const searchObject = {
      ...(placeName.length > 0 && { search_name__contains: placeName }),
      ...(address.length > 0 && { search_address__contains: address }),
      ...(ontologyIds.length > 0 && { data__ontology_ids__contains: ontologyIds }),
      ...(comment.length > 0 && { search_comments__contains: comment }),
      ...(publishPermission && { published: publishPermission === "yes" }),
      ...(district.length > 0 && { search_neighborhood: district }),
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
          setModerationPlaceResults({
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
        dispatch(setModerationPlaceResults({ results: [], count: 0 }));
      }
    }
  };

  const clearPlaceSearch = () => {
    dispatch(clearModerationPlaceSearch());
  };

  return (
    <div className={`formSection ${styles.placeSearch}`}>
      <div className={styles.header}>
        <h1 className="moderation">{i18n.t("moderation.placeSearch.title")}</h1>
        <div className="flexSpace" />
        <div>
          <Link href="/notification">
            <Button className={styles.primary} iconLeft={<IconPlus aria-hidden />}>
              {i18n.t("moderation.button.addNewPlace")}
            </Button>
          </Link>
        </div>
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
          options={languageOptions}
          value={convertValueWithId(language)}
          onChange={updateSearchLanguage}
          label={i18n.t("moderation.placeSearch.language.label")}
          selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
          clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
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

        <Combobox
          id="tag"
          className={styles.gridColumn1}
          // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
          options={convertOptions(tagOptions)}
          value={convertValues(ontologyIds)}
          onChange={updateSearchTags}
          label={i18n.t("moderation.placeSearch.tag.label")}
          toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
          multiselect
        />
        <TextInput
          id="comment"
          className={styles.gridColumn2}
          label={i18n.t("moderation.placeSearch.comment.label")}
          name="comment"
          value={comment}
          onChange={updateSearchText}
        />

        <div className={`${styles.gridColumn1} ${styles.searchButtons}`}>
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
