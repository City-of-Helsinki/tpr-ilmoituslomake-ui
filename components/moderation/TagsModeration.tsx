import React, { ChangeEvent, Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Combobox, TextInput } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationExtraKeywords, setModerationMatkoTag, setModerationTag } from "../../state/actions/moderation";
import { setModerationExtraKeywordsStatus, setModerationMatkoTagStatus, setModerationTagStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus } from "../../types/constants";
import { MatkoTagOption, OptionType, TagOption } from "../../types/general";
import { sortByOptionLabel } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import ModerationSection from "./ModerationSection";

const TagsModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
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
    return options.map((tag) => ({ id: tag.id, label: tag.ontologyword[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);
  };

  const convertMatkoOptions = (options: MatkoTagOption[]): OptionType[] => {
    return options.map((tag) => ({ id: tag.id, label: tag.matkoword[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);
  };

  const convertValues = (values: number[]): OptionType[] => {
    return convertOptions(tagOptions.filter((tag) => values.includes(tag.id)));
  };

  const convertMatkoValues = (values: number[]): OptionType[] => {
    return convertMatkoOptions(matkoTagOptions.filter((tag) => values.includes(tag.id)));
  };

  const updateTags = (selected: OptionType[]) => {
    dispatch(setModerationTag(selected.map((s) => s.id as number)));
  };

  const updateMatkoTags = (selected: OptionType[]) => {
    dispatch(setModerationMatkoTag(selected.map((s) => s.id as number)));
  };

  const updateExtraKeywords = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationExtraKeywords(evt.target.value));
  };

  const updateTagStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationTagStatus(status));
  };

  const updateMatkoTagStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationMatkoTagStatus(status));
  };

  const updateExtraKeywordsStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationExtraKeywordsStatus(status));
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
          modifyButtonLabel={i18n.t("moderation.tags.title")}
          changeCallback={updateTags}
          statusCallback={updateTagStatus}
          ModerationComponent={
            <Combobox
              id="tag"
              options={convertOptions(tagOptions)}
              label={i18n.t("moderation.tags.title")}
              helper={tagsStatus === ModerationStatus.Edited ? i18n.t("moderation.tags.add.helperText") : undefined}
              toggleButtonAriaLabel={i18n.t("moderation.button.toggleMenu")}
              selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
              clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
              multiselect
            />
          }
        />

        <ModerationSection
          id="extraKeywordsText"
          fieldName="extraKeywordsText"
          selectedValue={extraKeywordsTextSelected}
          modifiedValue={extraKeywordsTextModified}
          moderationStatus={extraKeywordsStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          helperText={i18n.t("moderation.tags.extraKeywords.helperText")}
          modifyButtonLabel={i18n.t("moderation.tags.extraKeywords.label")}
          changeCallback={updateExtraKeywords}
          statusCallback={updateExtraKeywordsStatus}
          ModerationComponent={<TextInput id="extraKeywordsText" label={i18n.t("moderation.tags.extraKeywords.label")} name="extraKeywordsText" />}
        />

        <ModerationSection
          id="matkoTag"
          fieldName="matkoTagModified"
          selectedValue={convertMatkoValues(matkoTagsSelected)}
          modifiedValue={convertMatkoValues(matkoTagsModified)}
          moderationStatus={matkoTagsStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("moderation.tags.matko")}
          changeCallback={updateMatkoTags}
          statusCallback={updateMatkoTagStatus}
          ModerationComponent={
            <Combobox
              id="tag"
              options={convertMatkoOptions(matkoTagOptions)}
              label={i18n.t("moderation.tags.matko")}
              helper={matkoTagsStatus === ModerationStatus.Edited ? i18n.t("moderation.tags.add.helperText") : undefined}
              toggleButtonAriaLabel={i18n.t("moderation.button.toggleMenu")}
              selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
              clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
              multiselect
            />
          }
        />
      </div>
    </div>
  );
};

export default TagsModeration;
