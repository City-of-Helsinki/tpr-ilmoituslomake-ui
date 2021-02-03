import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationAddress } from "../../state/actions/moderation";
import { setModerationAddressStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus } from "../../types/constants";
import ModerationSection from "./ModerationSection";

const LocationModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const {
    address: {
      fi: { street: streetFiSelected, postal_code: postalCodeFiSelected, post_office: postOfficeFiSelected, neighborhood: neighborhoodFiSelected },
      sv: { street: streetSvSelected, postal_code: postalCodeSvSelected, post_office: postOfficeSvSelected, neighborhood: neighborhoodSvSelected },
    },
  } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const {
    address: {
      fi: { street: streetFiModified, postal_code: postalCodeFiModified, post_office: postOfficeFiModified, neighborhood: neighborhoodFiModified },
      sv: { street: streetSvModified, postal_code: postalCodeSvModified, post_office: postOfficeSvModified, neighborhood: neighborhoodSvModified },
    },
  } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType } = moderationExtra;

  // Use the street status for all the fields
  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const {
    address: {
      fi: { street: addressFiStatus },
      sv: { street: addressSvStatus },
    },
  } = moderationStatus;

  const updateAddress = (language: string, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationAddress(language, { [evt.target.name]: evt.target.value }));
  };

  const updateAddressStatus = (language: string, status: ModerationStatus) => {
    // Update all address fields to the same status
    dispatchStatus(setModerationAddressStatus(language, { street: status, postal_code: status, post_office: status, neighborhood: status }));
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="streetAddressFi"
          fieldName="fi"
          selectedValue={streetFiSelected}
          modifiedValue={streetFiModified}
          status={addressFiStatus}
          taskType={taskType}
          selectedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}${i18n.t("moderation.task.modified")}`}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}`}
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="streetAddressFi"
              label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("general.inLanguage.fi")}`}
              name="street"
            />
          }
        />

        <ModerationSection
          id="postalCodeFi"
          fieldName="fi"
          selectedValue={postalCodeFiSelected}
          modifiedValue={postalCodeFiModified}
          status={addressFiStatus}
          taskType={taskType}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}`}
          modifyButtonHidden
          actionButtonHidden
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalCodeFi"
              label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("general.inLanguage.fi")}`}
              name="postal_code"
            />
          }
        />

        <ModerationSection
          id="postalOfficeFi"
          fieldName="fi"
          selectedValue={postOfficeFiSelected}
          modifiedValue={postOfficeFiModified}
          status={addressFiStatus}
          taskType={taskType}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}`}
          modifyButtonHidden
          actionButtonHidden
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalOfficeFi"
              label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("general.inLanguage.fi")}`}
              name="post_office"
            />
          }
        />

        <ModerationSection
          id="neighborhoodFi"
          fieldName="fi"
          selectedValue={neighborhoodFiSelected}
          modifiedValue={neighborhoodFiModified}
          status={addressFiStatus}
          taskType={taskType}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.fi")}`}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="neighborhoodFi"
              label={`${i18n.t("moderation.location.neighborhood.label")} ${i18n.t("general.inLanguage.fi")}`}
              name="neighborhood"
            />
          }
        />
      </div>

      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="streetAddressSv"
          fieldName="sv"
          selectedValue={streetSvSelected}
          modifiedValue={streetSvModified}
          status={addressSvStatus}
          taskType={taskType}
          selectedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}${i18n.t("moderation.task.modified")}`}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}`}
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="streetAddressSv"
              label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("general.inLanguage.sv")}`}
              name="street"
            />
          }
        />
        <ModerationSection
          id="postalCodeSv"
          fieldName="sv"
          selectedValue={postalCodeSvSelected}
          modifiedValue={postalCodeSvModified}
          status={addressSvStatus}
          taskType={taskType}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}`}
          modifyButtonHidden
          actionButtonHidden
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalCodeSv"
              label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("general.inLanguage.sv")}`}
              name="postal_code"
            />
          }
        />
        <ModerationSection
          id="postalOfficeSv"
          fieldName="sv"
          selectedValue={postOfficeSvSelected}
          modifiedValue={postOfficeSvModified}
          status={addressSvStatus}
          taskType={taskType}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}`}
          modifyButtonHidden
          actionButtonHidden
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalOfficeSv"
              label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("general.inLanguage.sv")}`}
              name="post_office"
            />
          }
        />
        <ModerationSection
          id="neighborhoodSv"
          fieldName="sv"
          selectedValue={neighborhoodSvSelected}
          modifiedValue={neighborhoodSvModified}
          status={addressSvStatus}
          taskType={taskType}
          modifyButtonLabel={`${i18n.t("moderation.location.address")} ${i18n.t("general.inLanguage.sv")}`}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="neighborhoodSv"
              label={`${i18n.t("moderation.location.neighborhood.label")} ${i18n.t("general.inLanguage.sv")}`}
              name="neighborhood"
            />
          }
        />{" "}
      </div>
    </div>
  );
};

export default LocationModeration;
