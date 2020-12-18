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

  // Use the street status for all the fields
  const addressFiStatus = streetFiStatus;
  const addressSvStatus = streetSvStatus;

  const updateAddress = (language: string, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationAddress(language, { [evt.target.name]: evt.target.value }));
  };

  const updateAddressStatus = (language: string, status: Status) => {
    // Update all address fields to the same status
    dispatchStatus(setModerationAddressStatus(language, { street: status, postal_code: status, post_office: status }));
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer">
        <h4 className="gridColumn1">{`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}${i18n.t(
          "moderation.task.selected"
        )}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}${i18n.t(
          "moderation.task.modified"
        )}`}</h4>
        <TextInput
          id="streetAddressFiSelected"
          className="gridColumn1 disabledTextColor"
          label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("general.inLanguage.fi")}`}
          name="street"
          value={streetFiSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}`}
          fieldName="fi"
          status={addressFiStatus}
          modifyCallback={updateAddressStatus}
        >
          <TextInput
            id="streetAddressFiModified"
            className="gridColumn2 disabledTextColor"
            label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("general.inLanguage.fi")}`}
            name="street"
            value={streetFiModified}
            onChange={(evt) => updateAddress("fi", evt)}
            disabled={streetFiStatus === Status.Approved || streetFiStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" fieldName="fi" status={addressFiStatus} actionCallback={updateAddressStatus} />
        <TextInput
          id="postalCodeFiSelected"
          className="gridColumn1 disabledTextColor"
          label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("general.inLanguage.fi")}`}
          name="postal_code"
          value={postalCodeFiSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}`}
          fieldName="fi"
          status={addressFiStatus}
          modifyCallback={updateAddressStatus}
          hidden
        >
          <TextInput
            id="postalCodeFiModified"
            className="gridColumn2 disabledTextColor"
            label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("general.inLanguage.fi")}`}
            name="postal_code"
            value={postalCodeFiModified}
            onChange={(evt) => updateAddress("fi", evt)}
            disabled={postalCodeFiStatus === Status.Approved || postalCodeFiStatus === Status.Rejected}
          />
        </ModifyButton>
        <TextInput
          id="postalOfficeFiSelected"
          className="gridColumn1 disabledTextColor"
          label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("general.inLanguage.fi")}`}
          name="post_office"
          value={postOfficeFiSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}`}
          fieldName="fi"
          status={addressFiStatus}
          modifyCallback={updateAddressStatus}
          hidden
        >
          <TextInput
            id="postalOfficeFiModified"
            className="gridColumn2 disabledTextColor"
            label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("general.inLanguage.fi")}`}
            name="post_office"
            value={postOfficeFiModified}
            onChange={(evt) => updateAddress("fi", evt)}
            disabled={postOfficeFiStatus === Status.Approved || postOfficeFiStatus === Status.Rejected}
          />
        </ModifyButton>
      </div>

      <div className="gridLayoutContainer">
        <h4 className="gridColumn1">{`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}${i18n.t(
          "moderation.task.selected"
        )}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}${i18n.t(
          "moderation.task.modified"
        )}`}</h4>
        <TextInput
          id="streetAddressSvSelected"
          className="gridColumn1 disabledTextColor"
          label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("general.inLanguage.sv")}`}
          name="street"
          value={streetSvSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}`}
          fieldName="sv"
          status={addressSvStatus}
          modifyCallback={updateAddressStatus}
        >
          <TextInput
            id="streetAddressSvModified"
            className="gridColumn2 disabledTextColor"
            label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("general.inLanguage.sv")}`}
            name="street"
            value={streetSvModified}
            onChange={(evt) => updateAddress("sv", evt)}
            disabled={streetSvStatus === Status.Approved || streetSvStatus === Status.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" fieldName="sv" status={addressSvStatus} actionCallback={updateAddressStatus} />
        <TextInput
          id="postalCodeSvSelected"
          className="gridColumn1 disabledTextColor"
          label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("general.inLanguage.sv")}`}
          name="postal_code"
          value={postalCodeSvSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}`}
          fieldName="sv"
          status={addressSvStatus}
          modifyCallback={updateAddressStatus}
          hidden
        >
          <TextInput
            id="postalCodeSvModified"
            className="gridColumn2 disabledTextColor"
            label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("general.inLanguage.sv")}`}
            name="postal_code"
            value={postalCodeSvModified}
            onChange={(evt) => updateAddress("sv", evt)}
            disabled={postalCodeSvStatus === Status.Approved || postalCodeSvStatus === Status.Rejected}
          />
        </ModifyButton>
        <TextInput
          id="postalOfficeSvSelected"
          className="gridColumn1 disabledTextColor"
          label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("general.inLanguage.sv")}`}
          name="post_office"
          value={postOfficeSvSelected}
          disabled
        />
        <ModifyButton
          className="gridColumn2"
          label={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}`}
          fieldName="sv"
          status={addressSvStatus}
          modifyCallback={updateAddressStatus}
          hidden
        >
          <TextInput
            id="postalOfficeSvModified"
            className="gridColumn2 disabledTextColor"
            label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("general.inLanguage.sv")}`}
            name="post_office"
            value={postOfficeSvModified}
            onChange={(evt) => updateAddress("sv", evt)}
            disabled={postOfficeSvStatus === Status.Approved || postOfficeSvStatus === Status.Rejected}
          />
        </ModifyButton>
      </div>
    </div>
  );
};

export default LocationModeration;
