import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationLink } from "../../state/actions/moderation";
import { setModerationLinkStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, LANGUAGE_OPTIONS } from "../../types/constants";
import ModerationSection from "./ModerationSection";

const LinksModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { website: websiteSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { website: websiteModified } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { website: websiteStatus } = moderationStatus;

  const updateWebsite = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationLink({ [evt.target.name]: evt.target.value }));
  };

  const updateWebsiteStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationLinkStatus({ [language]: status }));
  };

  return (
    <div className="formSection">
      <div className="languageSection gridLayoutContainer moderation">
        {LANGUAGE_OPTIONS.map((option, index) => (
          <ModerationSection
            id={`website_${option}`}
            key={`website_${option}`}
            fieldName={option}
            selectedValue={websiteSelected[option] as string}
            modifiedValue={websiteModified[option] as string}
            moderationStatus={websiteStatus[option]}
            taskType={taskType}
            taskStatus={taskStatus}
            selectedHeaderText={index === 0 ? `${i18n.t("moderation.links.website.label")}${i18n.t("moderation.task.selected")}` : undefined}
            modifiedHeaderText={index === 0 ? `${i18n.t("moderation.links.website.label")}${i18n.t("moderation.task.modified")}` : undefined}
            helperText={i18n.t("moderation.links.website.helperText")}
            modifyButtonLabel={i18n.t(`common.inLanguage.${option}`)}
            changeCallback={updateWebsite}
            statusCallback={updateWebsiteStatus}
            ModerationComponent={
              <TextInput
                id={`website_${option}`}
                label={`${i18n.t("moderation.links.website.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};

export default LinksModeration;
