import React, { ChangeEvent, Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Select, TextInput } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationExtraKeywords, setModerationMatkoTag, setModerationTag } from "../../state/actions/moderation";
import { setModerationExtraKeywordsStatus, setModerationMatkoTagStatus, setModerationTagStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, ModerationStatus } from "../../types/constants";
import { MatkoTagOption, OptionType, TagOption } from "../../types/general";
import { sortByOptionLabel } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import ModerationSection from "./ModerationSection";

const TagsModeration = (): ReactElement => {
  const i18n = useI18n();
  //const dispatch = useDispatch<Dispatch<ModerationAction>>();
  //const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const dispatch = useDispatch();
  const dispatchStatus = useDispatch();
  const router = useRouter();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { ontology_ids: tagsSelected, matko_ids: matkoTagsSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { ontology_ids: tagsModified, matko_ids: matkoTagsModified } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus, tagOptions, matkoTagOptions, extraKeywordsTextSelected, extraKeywordsTextModified } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { ontology_ids: tagsStatus, extra_keywords: extraKeywordsStatus, matko_ids: matkoTagsStatus } = moderationStatus;

  const convertOptions = (options: TagOption[]): OptionType[] => {
    return options.map((tag) => ({ value: tag.id, label: tag.ontologyword[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);
  };

  const convertMatkoOptions = (options: MatkoTagOption[]): OptionType[] => {
    return options.map((tag) => ({ value: tag.id, label: tag.matkoword[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);
  };

  const convertValues = (values: number[]): OptionType[] => {
    return convertOptions(tagOptions.filter((tag) => values.includes(tag.id)));
  };

  const convertMatkoValues = (values: number[]): OptionType[] => {
    return convertMatkoOptions(matkoTagOptions.filter((tag) => values.includes(tag.id)));
  };

  const updateTags = (selected: OptionType[]) => {
    dispatch(setModerationTag(selected.map((s) => s.value as number)));
  };

  const updateMatkoTags = (selected: OptionType[]) => {
    dispatch(setModerationMatkoTag(selected.map((s) => s.value as number)));
  };

  const updateExtraKeywords = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationExtraKeywords(evt.target.name, evt.target.value));
  };

  const updateTagStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationTagStatus(status));
  };

  const updateMatkoTagStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationMatkoTagStatus(status));
  };

  const updateExtraKeywordsStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationExtraKeywordsStatus({ [language]: status }));
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="tag"
          fieldName="tagModified"
          selectedValue={convertValues(tagsSelected)}
          modifiedValue={convertValues(tagsModified)}
          moderationStatus={tagsStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          selectedHeaderText={`${i18n.t("moderation.tags.title")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.tags.title")}${i18n.t("moderation.task.modified")}`}
          changeCallback={updateTags}
          statusCallback={updateTagStatus}
          ModerationComponent={
            <Select
              id="tag"
              // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
              options={convertOptions(tagOptions)}
              texts={{
                label: i18n.t("moderation.tags.title"),
                assistive: tagsStatus === ModerationStatus.Edited ? i18n.t("moderation.tags.add.helperText") : undefined,
                dropdownButtonAriaLabel: i18n.t("moderation.button.toggleMenu"),
                tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
                tagsClearAllButton: i18n.t("moderation.button.clearAllSelections"),
              }}
              multiSelect
            />
          }
        />
      </div>

      <div className="languageSection gridLayoutContainer moderation">
        {LANGUAGE_OPTIONS.map((option) => (
          <ModerationSection
            id={`extraKeywordsText_${option}`}
            key={`extraKeywordsText_${option}`}
            fieldName={option}
            selectedValue={extraKeywordsTextSelected[option] as string}
            modifiedValue={extraKeywordsTextModified[option] as string}
            moderationStatus={extraKeywordsStatus[option]}
            taskType={taskType}
            taskStatus={taskStatus}
            helperText={i18n.t("moderation.tags.extraKeywords.helperText")}
            changeCallback={updateExtraKeywords}
            statusCallback={updateExtraKeywordsStatus}
            ModerationComponent={
              <TextInput
                id={`extraKeywordsText_${option}`}
                lang={option}
                label={`${i18n.t("moderation.tags.extraKeywords.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>

      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="matkoTag"
          fieldName="matkoTagModified"
          selectedValue={convertMatkoValues(matkoTagsSelected)}
          modifiedValue={convertMatkoValues(matkoTagsModified)}
          moderationStatus={matkoTagsStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          changeCallback={updateMatkoTags}
          statusCallback={updateMatkoTagStatus}
          ModerationComponent={
            <Select
              id="tag"
              // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
              options={convertMatkoOptions(matkoTagOptions)}
              texts={{
                label: i18n.t("moderation.tags.matko"),
                assistive: matkoTagsStatus === ModerationStatus.Edited ? i18n.t("moderation.tags.add.helperText") : undefined,
                dropdownButtonAriaLabel: i18n.t("moderation.button.toggleMenu"),
                tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
                tagsClearAllButton: i18n.t("moderation.button.clearAllSelections"),
              }}
              multiSelect
            />
          }
        />
      </div>
    </div>
  );
};

export default TagsModeration;
