import React, { Dispatch, ChangeEvent, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationLink } from "../../state/actions/moderation";
import { setModerationLinkStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { Status, LANGUAGE_OPTIONS } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

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

  const updateWebsiteStatus = (language: string, status: Status) => {
    dispatchStatus(setModerationLinkStatus({ [language]: status }));
  };

  return (
    <div className="formSection">
      <div className="languageSection gridLayoutContainer">
        <h4 className="gridColumn1">{`${i18n.t("moderation.links.website.label")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.links.website.label")}${i18n.t("moderation.task.modified")}`}</h4>
        {LANGUAGE_OPTIONS.map((option) => (
          <Fragment key={`website_${option}`}>
            <TextInput
              id={`websiteSelected_${option}`}
              className="gridColumn1 disabledTextColor"
              label={`${i18n.t("moderation.links.website.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
              name={option}
              value={websiteSelected[option] as string}
              disabled
            />
            <ModifyButton
              className="gridColumn2"
              label={`${i18n.t("moderation.links.website.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
              fieldName={option}
              status={websiteStatus[option]}
              modifyCallback={updateWebsiteStatus}
            >
              <TextInput
                id={`websiteModified_${option}`}
                className="gridColumn2 disabledTextColor"
                label={`${i18n.t("moderation.links.website.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                name={option}
                value={websiteModified[option] as string}
                onChange={updateWebsite}
                disabled={websiteStatus[option] === Status.Approved || websiteStatus[option] === Status.Rejected}
              />
            </ModifyButton>
            <ActionButton className="gridColumn3" fieldName={option} status={websiteStatus[option]} actionCallback={updateWebsiteStatus} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default LinksModeration;
