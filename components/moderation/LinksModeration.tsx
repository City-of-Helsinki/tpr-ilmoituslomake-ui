import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
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
      <div className="languageSection gridLayoutContainer">
        <h4 className="gridColumn1">{`${i18n.t("moderation.links.website.label")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.links.website.label")}${i18n.t("moderation.task.modified")}`}</h4>

        {LANGUAGE_OPTIONS.map((option) => (
          <ModerationSection
            id={`website_${option}`}
            key={`website_${option}`}
            fieldName={option}
            selectedValue={websiteSelected[option] as string}
            modifiedValue={websiteModified[option] as string}
            status={websiteStatus[option]}
            modifyButtonLabel={`${i18n.t("moderation.links.website.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
            changeCallback={updateWebsite}
            statusCallback={updateWebsiteStatus}
            ModerationComponent={
              <TextInput
                id={`website_${option}`}
                label={`${i18n.t("moderation.links.website.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
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
