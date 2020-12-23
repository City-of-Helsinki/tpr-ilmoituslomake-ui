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
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

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
      <div className="gridLayoutContainer">
        <h4 className="gridColumn1">{`${i18n.t("moderation.tags.title")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.tags.title")}${i18n.t("moderation.task.modified")}`}</h4>
        <Combobox
          id="tagSelected"
          className="gridColumn1"
          // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
          options={convertOptions(tagOptions)}
          value={convertValues(tagsSelected)}
          label={i18n.t("moderation.tags.add.label")}
          toggleButtonAriaLabel={i18n.t("moderation.button.toggleMenu")}
          selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
          clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
          multiselect
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={i18n.t("moderation.tags.title")}
          fieldName="tagModified"
          status={tagsStatus}
          modifyCallback={updateTagStatus}
        >
          <Combobox
            id="tagModified"
            className="gridColumn2"
            // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
            options={convertOptions(tagOptions)}
            value={convertValues(tagsModified)}
            onChange={updateTags}
            label={i18n.t("moderation.tags.add.label")}
            toggleButtonAriaLabel={i18n.t("moderation.button.toggleMenu")}
            selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
            clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
            multiselect
            disabled={tagsStatus === ModerationStatus.Approved || tagsStatus === ModerationStatus.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" fieldName="tagModified" status={tagsStatus} actionCallback={updateTagStatus} />
      </div>
    </div>
  );
};

export default TagsModeration;
