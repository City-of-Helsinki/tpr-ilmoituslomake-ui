import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Combobox } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationTag } from "../../state/actions/moderation";
import { setModerationTagStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { Status } from "../../types/constants";
import { TagOption } from "../../types/general";
import { defaultLocale } from "../../utils/i18n";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

type OptionType = {
  id: number;
  label: string;
};

const TagsModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const router = useRouter();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { ontology_ids: tagsSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { ontology_ids: tagsModified } = modifiedTask;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { tagOptions } = notificationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { ontology_ids: tagsStatus } = moderationStatus;

  const convertOptions = (options: TagOption[]): OptionType[] => {
    return options.map((tag) => ({ id: tag.id, label: tag.ontologyword[router.locale || defaultLocale] as string }));
  };

  const convertValues = (values: number[]): OptionType[] => {
    return convertOptions(tagOptions.filter((tag) => values.includes(tag.id)));
  };

  const updateTags = (selected: OptionType[]) => {
    dispatch(setModerationTag(selected.map((s) => s.id)));
  };

  const updateTagStatus = (language: string, status: Status) => {
    dispatchStatus(setModerationTagStatus(status));
  };

  return (
    <div className="formSection">
      <div className="gridContainer">
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
          targetName="tagModified"
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
            disabled={tagsStatus === Status.Approved || tagsStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" targetName="tagModified" status={tagsStatus} actionCallback={updateTagStatus} />
      </div>
    </div>
  );
};

export default TagsModeration;
