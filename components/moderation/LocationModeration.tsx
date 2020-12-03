import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationAddress } from "../../state/actions/moderation";
import { setModerationAddressStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { Status } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

const LocationModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const {
    address: {
      fi: { street: streetFiSelected, postal_code: postalCodeFiSelected, post_office: postOfficeFiSelected },
      sv: { street: streetSvSelected, postal_code: postalCodeSvSelected, post_office: postOfficeSvSelected },
    },
  } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const {
    address: {
      fi: { street: streetFiModified, postal_code: postalCodeFiModified, post_office: postOfficeFiModified },
      sv: { street: streetSvModified, postal_code: postalCodeSvModified, post_office: postOfficeSvModified },
    },
  } = modifiedTask;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const {
    address: {
      fi: { street: streetFiStatus, postal_code: postalCodeFiStatus, post_office: postOfficeFiStatus },
      sv: { street: streetSvStatus, postal_code: postalCodeSvStatus, post_office: postOfficeSvStatus },
    },
  } = moderationStatus;

  const updateAddress = (language: string, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationAddress(language, { [evt.target.name]: evt.target.value }));
  };

  const updateAddressFiStatus = (addressField: string, status: Status) => {
    dispatchStatus(setModerationAddressStatus("fi", { [addressField]: status }));
  };

  const updateAddressSvStatus = (addressField: string, status: Status) => {
    dispatchStatus(setModerationAddressStatus("sv", { [addressField]: status }));
  };

  return (
    <div className="formSection">
      <div className="gridContainer">
        <h4 className="gridColumn1">{`${i18n.t("moderation.location.address")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.location.address")}${i18n.t("moderation.task.modified")}`}</h4>
        <TextInput
          id="streetAddressFiSelected"
          className="gridColumn1"
          label={i18n.t("moderation.location.streetAddress.label")}
          name="street"
          value={streetFiSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={i18n.t("moderation.location.streetAddress.label")}
          targetName="street"
          status={streetFiStatus}
          modifyCallback={updateAddressFiStatus}
        >
          <TextInput
            id="streetAddressFiModified"
            className="gridColumn2"
            label={i18n.t("moderation.location.streetAddress.label")}
            name="street"
            value={streetFiModified}
            onChange={(evt) => updateAddress("fi", evt)}
            disabled={streetFiStatus === Status.Approved || streetFiStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" targetName="street" status={streetFiStatus} actionCallback={updateAddressFiStatus} />
      </div>

      <div className="gridContainer">
        <TextInput
          id="postalCodeFiSelected"
          className="gridColumn1"
          label={i18n.t("moderation.location.postalCode.label")}
          name="postal_code"
          value={postalCodeFiSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={i18n.t("moderation.location.postalCode.label")}
          targetName="postal_code"
          status={postalCodeFiStatus}
          modifyCallback={updateAddressFiStatus}
        >
          <TextInput
            id="postalCodeFiModified"
            className="gridColumn2"
            label={i18n.t("moderation.location.postalCode.label")}
            name="postal_code"
            value={postalCodeFiModified}
            onChange={(evt) => updateAddress("fi", evt)}
            disabled={postalCodeFiStatus === Status.Approved || postalCodeFiStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" targetName="postal_code" status={postalCodeFiStatus} actionCallback={updateAddressFiStatus} />
      </div>

      <div className="gridContainer">
        <TextInput
          id="postalOfficeFiSelected"
          className="gridColumn1"
          label={i18n.t("moderation.location.postalOffice.label")}
          name="post_office"
          value={postOfficeFiSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={i18n.t("moderation.location.postalOffice.label")}
          targetName="post_office"
          status={postOfficeFiStatus}
          modifyCallback={updateAddressFiStatus}
        >
          <TextInput
            id="postalOfficeFiModified"
            className="gridColumn2"
            label={i18n.t("moderation.location.postalOffice.label")}
            name="post_office"
            value={postOfficeFiModified}
            onChange={(evt) => updateAddress("fi", evt)}
            disabled={postOfficeFiStatus === Status.Approved || postOfficeFiStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" targetName="post_office" status={postOfficeFiStatus} actionCallback={updateAddressFiStatus} />
      </div>
    </div>
  );
};

export default LocationModeration;
