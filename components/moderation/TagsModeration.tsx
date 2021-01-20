import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Combobox } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationTag } from "../../state/actions/moderation";
import { setModerationTagStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus } from "../../types/constants";
import { OptionType, TagOption } from "../../types/general";
import { defaultLocale } from "../../utils/i18n";
import ModerationSection from "./ModerationSection";

const TagsModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const router = useRouter();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { ontology_ids: tagsSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { ontology_ids: tagsModified } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { tagOptions } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { ontology_ids: tagsStatus } = moderationStatus;

  const convertOptions = (options: TagOption[]): OptionType[] => {
    return options.map((tag) => ({ id: tag.id, label: tag.ontologyword[router.locale || defaultLocale] as string }));
  };

  const convertValues = (values: number[]): OptionType[] => {
    return convertOptions(tagOptions.filter((tag) => values.includes(tag.id)));
  };

  const updateTags = (selected: OptionType[]) => {
    dispatch(setModerationTag(selected.map((s) => s.id as number)));
  };

  const updateTagStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationTagStatus(status));
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer moderation">
        <h4 className="gridColumn1">{`${i18n.t("moderation.tags.title")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.tags.title")}${i18n.t("moderation.task.modified")}`}</h4>

        <ModerationSection
          id="tag"
          fieldName="tagModified"
          selectedValue={convertValues(tagsSelected)}
          modifiedValue={convertValues(tagsModified)}
          status={tagsStatus}
          modifyButtonLabel={i18n.t("moderation.tags.title")}
          changeCallback={updateTags}
          statusCallback={updateTagStatus}
          ModerationComponent={
            <Combobox
              id="tag"
              options={convertOptions(tagOptions)}
              label={i18n.t("moderation.tags.title")}
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
