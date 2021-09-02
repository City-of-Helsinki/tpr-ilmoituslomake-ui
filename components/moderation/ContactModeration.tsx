import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationContact } from "../../state/actions/moderation";
import { setModerationContactStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus } from "../../types/constants";
import ModerationSection from "./ModerationSection";

const ContactModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { phone: phoneSelected, email: emailSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { phone: phoneModified, email: emailModified } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { phone: phoneStatus, email: emailStatus } = moderationStatus;

  const updateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationContact({ [evt.target.name]: evt.target.value }));
  };

  const updateContactStatus = (contactField: string, status: ModerationStatus) => {
    dispatchStatus(setModerationContactStatus({ [contactField]: status }));
  };

  return (
    <div id="contact" className="formSection">
      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="phone"
          fieldName="phone"
          selectedValue={phoneSelected}
          modifiedValue={phoneModified}
          moderationStatus={phoneStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          selectedHeaderText={`${i18n.t("moderation.contact.title")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.contact.title")}${i18n.t("moderation.task.modified")}`}
          helperText={i18n.t("moderation.contact.phone.helperText")}
          modifyButtonLabel={i18n.t("moderation.contact.phone.label")}
          changeCallback={updateContact}
          statusCallback={updateContactStatus}
          ModerationComponent={<TextInput id="phone" label={i18n.t("moderation.contact.phone.label")} name="phone" />}
        />

        <ModerationSection
          id="email"
          fieldName="email"
          selectedValue={emailSelected}
          modifiedValue={emailModified}
          moderationStatus={emailStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("moderation.contact.email.label")}
          changeCallback={updateContact}
          statusCallback={updateContactStatus}
          ModerationComponent={<TextInput id="email" label={i18n.t("moderation.contact.email.label")} name="email" />}
        />
      </div>
    </div>
  );
};

export default ContactModeration;
