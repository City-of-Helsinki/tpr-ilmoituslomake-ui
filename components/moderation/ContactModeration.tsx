import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationContact } from "../../state/actions/moderation";
import { setModerationContactStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { Status } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

const ContactModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { phone: phoneSelected, email: emailSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { phone: phoneModified, email: emailModified } = modifiedTask;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { phone: phoneStatus, email: emailStatus } = moderationStatus;

  const updateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationContact({ [evt.target.name]: evt.target.value }));
  };

  const updateContactStatus = (contactField: string, status: Status) => {
    dispatchStatus(setModerationContactStatus({ [contactField]: status }));
  };

  return (
    <div className="formSection">
      <div className="gridContainer">
        <h4 className="gridColumn1">{`${i18n.t("moderation.contact.title")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.contact.title")}${i18n.t("moderation.task.modified")}`}</h4>
        <TextInput
          id="phoneSelected"
          className="gridColumn1"
          label={i18n.t("moderation.contact.phone.label")}
          name="phone"
          value={phoneSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={i18n.t("moderation.contact.phone.label")}
          fieldName="phone"
          status={phoneStatus}
          modifyCallback={updateContactStatus}
        >
          <TextInput
            id="phoneModified"
            className="gridColumn2"
            label={i18n.t("moderation.contact.phone.label")}
            name="phone"
            value={phoneModified}
            onChange={updateContact}
            disabled={phoneStatus === Status.Approved || phoneStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" fieldName="phone" status={phoneStatus} actionCallback={updateContactStatus} />
      </div>

      <div className="gridContainer">
        <TextInput
          id="emailSelected"
          className="gridColumn1"
          label={i18n.t("moderation.contact.email.label")}
          name="email"
          value={emailSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={i18n.t("moderation.contact.email.label")}
          fieldName="email"
          status={emailStatus}
          modifyCallback={updateContactStatus}
        >
          <TextInput
            id="emailModified"
            className="gridColumn2"
            label={i18n.t("moderation.contact.email.label")}
            name="email"
            value={emailModified}
            onChange={updateContact}
            disabled={emailStatus === Status.Approved || emailStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" fieldName="email" status={emailStatus} actionCallback={updateContactStatus} />
      </div>
    </div>
  );
};

export default ContactModeration;
