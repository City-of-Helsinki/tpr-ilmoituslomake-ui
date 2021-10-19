import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, TextInput } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationAddress } from "../../state/actions/moderation";
import { setModerationAddressStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, TaskStatus } from "../../types/constants";
import { searchModerationAddress } from "../../utils/addressModeration";
import ModerationSection from "./ModerationSection";
import styles from "./LocationModeration.module.scss";

const LocationModeration = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const {
    address: {
      fi: {
        street: streetFiSelected,
        postal_code: postalCodeFiSelected,
        post_office: postOfficeFiSelected,
        neighborhood_id: neighborhoodIdFiSelected,
        neighborhood: neighborhoodFiSelected,
      },
      sv: {
        street: streetSvSelected,
        postal_code: postalCodeSvSelected,
        post_office: postOfficeSvSelected,
        neighborhood_id: neighborhoodIdSvSelected,
        neighborhood: neighborhoodSvSelected,
      },
    },
  } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const {
    address: {
      fi: {
        street: streetFiModified,
        postal_code: postalCodeFiModified,
        post_office: postOfficeFiModified,
        neighborhood_id: neighborhoodIdFiModified,
        neighborhood: neighborhoodFiModified,
      },
      sv: {
        street: streetSvModified,
        postal_code: postalCodeSvModified,
        post_office: postOfficeSvModified,
        neighborhood_id: neighborhoodIdSvModified,
        neighborhood: neighborhoodSvModified,
      },
    },
  } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus } = moderationExtra;

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
    dispatchStatus(
      setModerationAddressStatus(language, {
        street: status,
        postal_code: status,
        post_office: status,
        neighborhood_id: status,
        neighborhood: status,
      })
    );
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="streetAddressFi"
          fieldName="fi"
          selectedValue={streetFiSelected}
          modifiedValue={streetFiModified}
          moderationStatus={addressFiStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          selectedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("common.inLanguage.fi")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("common.inLanguage.fi")}${i18n.t("moderation.task.modified")}`}
          modifyButtonLabel={i18n.t("common.inLanguage.fi")}
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="streetAddressFi"
              label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("common.inLanguage.fi")}`}
              name="street"
            />
          }
        />

        <ModerationSection
          id="postalCodeFi"
          fieldName="fi"
          selectedValue={postalCodeFiSelected}
          modifiedValue={postalCodeFiModified}
          moderationStatus={addressFiStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.fi")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalCodeFi"
              label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("common.inLanguage.fi")}`}
              name="postal_code"
            />
          }
        />

        <ModerationSection
          id="postalOfficeFi"
          fieldName="fi"
          selectedValue={postOfficeFiSelected}
          modifiedValue={postOfficeFiModified}
          moderationStatus={addressFiStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.fi")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalOfficeFi"
              label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("common.inLanguage.fi")}`}
              name="post_office"
            />
          }
        />

        <ModerationSection
          id="neighborhoodIdFi"
          fieldName="fi"
          selectedValue={neighborhoodIdFiSelected}
          modifiedValue={neighborhoodIdFiModified}
          moderationStatus={addressFiStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.fi")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="neighborhoodIdFi"
              label={`${i18n.t("moderation.location.neighborhoodId.label")} ${i18n.t("common.inLanguage.fi")}`}
              name="neighborhoodId"
            />
          }
        />

        <ModerationSection
          id="neighborhoodFi"
          fieldName="fi"
          selectedValue={neighborhoodFiSelected}
          modifiedValue={neighborhoodFiModified}
          moderationStatus={addressFiStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.fi")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("fi", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="neighborhoodFi"
              label={`${i18n.t("moderation.location.neighborhood.label")} ${i18n.t("common.inLanguage.fi")}`}
              name="neighborhood"
            />
          }
        />
      </div>

      {addressFiStatus === ModerationStatus.Edited && (
        <div className="gridLayoutContainer moderation">
          <div className={styles.gridSelected} />
          <div className={styles.gridModified}>
            <Button
              variant="secondary"
              onClick={() => searchModerationAddress(router, streetFiModified, postOfficeFiModified, dispatch)}
              disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled}
            >
              {i18n.t("moderation.map.geocode")}
            </Button>
          </div>
          <div className={styles.gridActionButton} />
        </div>
      )}

      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="streetAddressSv"
          fieldName="sv"
          selectedValue={streetSvSelected}
          modifiedValue={streetSvModified}
          moderationStatus={addressSvStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          selectedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("common.inLanguage.sv")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.location.address")} ${i18n.t("common.inLanguage.sv")}${i18n.t("moderation.task.modified")}`}
          modifyButtonLabel={i18n.t("common.inLanguage.sv")}
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="streetAddressSv"
              label={`${i18n.t("moderation.location.streetAddress.label")} ${i18n.t("common.inLanguage.sv")}`}
              name="street"
            />
          }
        />

        <ModerationSection
          id="postalCodeSv"
          fieldName="sv"
          selectedValue={postalCodeSvSelected}
          modifiedValue={postalCodeSvModified}
          moderationStatus={addressSvStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.sv")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalCodeSv"
              label={`${i18n.t("moderation.location.postalCode.label")} ${i18n.t("common.inLanguage.sv")}`}
              name="postal_code"
            />
          }
        />

        <ModerationSection
          id="postalOfficeSv"
          fieldName="sv"
          selectedValue={postOfficeSvSelected}
          modifiedValue={postOfficeSvModified}
          moderationStatus={addressSvStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.sv")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="postalOfficeSv"
              label={`${i18n.t("moderation.location.postalOffice.label")} ${i18n.t("common.inLanguage.sv")}`}
              name="post_office"
            />
          }
        />

        <ModerationSection
          id="neighborhoodIdSv"
          fieldName="sv"
          selectedValue={neighborhoodIdSvSelected}
          modifiedValue={neighborhoodIdSvModified}
          moderationStatus={addressSvStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.sv")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="neighborhoodIdSv"
              label={`${i18n.t("moderation.location.neighborhoodId.label")} ${i18n.t("common.inLanguage.sv")}`}
              name="neighborhoodId"
            />
          }
        />

        <ModerationSection
          id="neighborhoodSv"
          fieldName="sv"
          selectedValue={neighborhoodSvSelected}
          modifiedValue={neighborhoodSvModified}
          moderationStatus={addressSvStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("common.inLanguage.sv")}
          modifyButtonHidden
          actionButtonHidden
          bypassModifiedFieldCheck
          changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateAddress("sv", evt)}
          statusCallback={updateAddressStatus}
          ModerationComponent={
            <TextInput
              id="neighborhoodSv"
              label={`${i18n.t("moderation.location.neighborhood.label")} ${i18n.t("common.inLanguage.sv")}`}
              name="neighborhood"
            />
          }
        />
      </div>

      {addressSvStatus === ModerationStatus.Edited && (
        <div className="gridLayoutContainer moderation">
          <div className={styles.gridSelected} />
          <div className={styles.gridModified}>
            <Button
              variant="secondary"
              onClick={() => searchModerationAddress(router, streetSvModified, postOfficeSvModified, dispatch)}
              disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled}
            >
              {i18n.t("moderation.map.geocode")}
            </Button>
          </div>
          <div className={styles.gridActionButton} />
        </div>
      )}
    </div>
  );
};

export default LocationModeration;
