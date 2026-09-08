import React, { ChangeEvent, Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Select, TextInput, Checkbox, RadioButton } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import {
  setModerationCertificate,
  setModerationLabel,
  setModerationOtherCertificate,
  setModerationOtherCertificateUrl,
  setModerationNoCertificate,
} from "../../state/actions/moderation";
import {
  setModerationOtherCertificateStatus,
  setModerationCertificateStatus,
  setModerationLabelStatus,
  setModerationOtherCertificateUrlStatus,
  setModerationNoCertificateStatus,
} from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, ModerationStatus } from "../../types/constants";
import { OptionType, CertificateOption } from "../../types/general";
import { sortByOptionLabel } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import ModerationSection from "./ModerationSection";

const CertificateModeration = (): ReactElement => {
  const i18n = useI18n();
  //const dispatch = useDispatch<Dispatch<ModerationAction>>();
  //const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const dispatch = useDispatch();
  const dispatchStatus = useDispatch();
  const router = useRouter();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { certificate_ids: certificatesSelected, label_ids: labelsSeleted, no_certificate: noCertificateSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { certificate_ids: certificatesModified, label_ids: labelsModified, no_certificate: noCertificateModified } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const {
    taskType,
    taskStatus,
    certificateOptions,
    labelOptions,
    otherCertificatesSelected,
    otherCertificatesModified,
    otherCertificatesUrlSelected,
    otherCertificatesUrlModified,
  } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const {
    certificate_ids: certificatesStatus,
    label_ids: labelsStatus,
    other_certificates: otherCertificateStatus,
    other_certificates_url: otherCertificateUrlStatus,
  } = moderationStatus;

  const convertOptions = (options: CertificateOption[]): OptionType[] => {
    return options
      .map((certificate) => ({ value: certificate.id, label: certificate.certificatename[router.locale || defaultLocale] as string }))
      .sort(sortByOptionLabel);
  };

  const convertValues = (values: number[]): OptionType[] => {
    return convertOptions(certificateOptions.filter((certificate) => values.includes(certificate.id)));
  };

  function filterCertificates(cert: CertificateOption) {
    if (cert.certificate_type === "Label") {
      return false;
    } else {
      return true;
    }
  }

  function filterLabels(cert: CertificateOption) {
    if (cert.certificate_type === "Label") {
      return true;
    } else {
      return false;
    }
  }

  const mainCertificateOptions = certificateOptions.filter(filterCertificates);

  const labelCertificates = certificateOptions.filter(filterLabels);

  const updateCertificates = (selected: OptionType[]) => {
    dispatch(setModerationCertificate(selected.map((s) => s.value as number)));
    if (selected.length > 0) {
      setModerationNoCertificate(false);
    } else {
      setModerationNoCertificate(true);
    }
  };

  const updateLabels = (selected: OptionType[]) => {
    dispatch(setModerationLabel(selected.map((s) => s.value as number)));
  };

  const updateOtherCertificate = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationOtherCertificate(evt.target.name, evt.target.value));
  };

  const updateOtherCertificateUrl = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationOtherCertificateUrl(evt.target.name, evt.target.value));
  };

  const updateCertificateStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationCertificateStatus(status));
  };

  const updateLabelsStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationLabelStatus(status));
  };

  const updateOtherCertificateStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationOtherCertificateStatus({ [language]: status }));
  };

  const updateOtherCertificateUrlStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationOtherCertificateUrlStatus({ [language]: status }));
  };

  const updateNoCertificate = (evt: ChangeEvent<HTMLInputElement>) => {
    const selected = evt.target.checked;
    dispatch(setModerationNoCertificate(selected));
  };

  const updateNoCertificateStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationNoCertificateStatus(status));
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="labelCertificate"
          fieldName="labelModified"
          selectedValue={convertValues(labelsSeleted)}
          modifiedValue={convertValues(labelsModified)}
          moderationStatus={labelsStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          selectedHeaderText={`${i18n.t("moderation.labels.title")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.labels.title")}${i18n.t("moderation.task.modified")}`}
          changeCallback={updateLabels}
          statusCallback={updateLabelsStatus}
          ModerationComponent={
            <Select
              id="labelList"
              // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
              options={convertOptions(labelCertificates)}
              texts={{
                label: i18n.t("moderation.labels.title"),
                assistive: labelsStatus === ModerationStatus.Edited ? i18n.t("moderation.certificates.add.helperText") : undefined,
                dropdownButtonAriaLabel: i18n.t("moderation.button.toggleMenu"),
                tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
                tagsClearAllButton: i18n.t("moderation.button.clearAllSelections"),
              }}
              multiSelect
            />
          }
        />
      </div>
      <div className="gridLayoutContainer moderation">
        <ModerationSection
          id="certificate"
          fieldName="certificateModified"
          selectedValue={convertValues(certificatesSelected)}
          modifiedValue={convertValues(certificatesModified)}
          moderationStatus={certificatesStatus}
          taskType={taskType}
          taskStatus={taskStatus}
          selectedHeaderText={`${i18n.t("moderation.certificates.title")}${i18n.t("moderation.task.selected")}`}
          modifiedHeaderText={`${i18n.t("moderation.certificates.title")}${i18n.t("moderation.task.modified")}`}
          changeCallback={updateCertificates}
          statusCallback={updateCertificateStatus}
          ModerationComponent={
            <Select
              id="certificateList"
              // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
              options={convertOptions(mainCertificateOptions)}
              texts={{
                  label: i18n.t("moderation.certificates.title"),
                  assistive: certificatesStatus === ModerationStatus.Edited ? i18n.t("moderation.certificates.add.helperText") : undefined,
                  dropdownButtonAriaLabel: i18n.t("moderation.button.toggleMenu"),
                  tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
                  tagsClearAllButton: i18n.t("moderation.button.clearAllSelections"),
              }}
              multiSelect
            />
          }
        />
      </div>

      <div className="languageSection gridLayoutContainer moderation">
        {LANGUAGE_OPTIONS.map((option) => (
          <ModerationSection
            id={`otherCertificateText_${option}`}
            key={`otherCertificateText_${option}`}
            fieldName={option}
            selectedValue={otherCertificatesSelected[option] as string}
            modifiedValue={otherCertificatesModified[option] as string}
            moderationStatus={otherCertificateStatus[option]}
            taskType={taskType}
            taskStatus={taskStatus}
            helperText=""
            changeCallback={updateOtherCertificate}
            statusCallback={updateOtherCertificateStatus}
            ModerationComponent={
              <TextInput
                id={`otherCertificateText_${option}`}
                lang={option}
                label={`${i18n.t("moderation.certificates.otherCertificates.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>
      <div className="languageSection gridLayoutContainer moderation">
        {LANGUAGE_OPTIONS.map((option) => (
          <ModerationSection
            id={`otherCertificateUrl_${option}`}
            key={`otherCertificateUrl_${option}`}
            fieldName={option}
            selectedValue={otherCertificatesUrlSelected[option] as string}
            modifiedValue={otherCertificatesUrlModified[option] as string}
            moderationStatus={otherCertificateUrlStatus[option]}
            taskType={taskType}
            taskStatus={taskStatus}
            helperText=""
            changeCallback={updateOtherCertificateUrl}
            statusCallback={updateOtherCertificateUrlStatus}
            ModerationComponent={
              <TextInput
                id={`otherCertificateUrlText_${option}`}
                lang={option}
                label={`${i18n.t("moderation.certificates.otherCertificatesUrl.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CertificateModeration;
