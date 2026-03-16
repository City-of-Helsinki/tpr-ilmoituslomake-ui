import React, { ChangeEvent, Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Combobox, TextInput } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationCertificate, setModerationOtherCertificate } from "../../state/actions/moderation";
import { setModerationOtherCertificateStatus, setModerationCertificateStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, ModerationStatus } from "../../types/constants";
import { OptionType, CertificateOption } from "../../types/general";
import { sortByOptionLabel } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import ModerationSection from "./ModerationSection";

const CertificateModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const router = useRouter();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { certificate_ids: certificatesSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { certificate_ids: certificatesModified } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus, certificateOptions, otherCertificateTextSelected, otherCertificateTextModified } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { certificate_ids: certificatesStatus, other_certificates: otherCertificateStatus } = moderationStatus;

  const convertOptions = (options: CertificateOption[]): OptionType[] => {
    return options.map((certificate) => ({ id: certificate.id, label: certificate.certificatename[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);
  };

  const convertValues = (values: number[]): OptionType[] => {
    return convertOptions(certificateOptions.filter((certificate) => values.includes(certificate.id)));
  };

  const updateCertificates = (selected: OptionType[]) => {
    dispatch(setModerationCertificate(selected.map((s) => s.id as number)));
  };

  const updateOtherCertificate = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationOtherCertificate(evt.target.name, evt.target.value));
  };

  const updateCertificateStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationCertificateStatus(status));
  };

  const updateOtherCertificateStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationOtherCertificateStatus({ [language]: status }));
  };

  return (
    <div className="formSection">
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
            <Combobox
              id="certificate"
              options={convertOptions(certificateOptions)}
              label={i18n.t("moderation.certificates.title")}
              helper={certificatesStatus === ModerationStatus.Edited ? i18n.t("moderation.certificates.add.helperText") : undefined}
              toggleButtonAriaLabel={i18n.t("moderation.button.toggleMenu")}
              selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
              clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
              multiselect
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
            selectedValue={otherCertificateTextSelected[option] as string}
            modifiedValue={otherCertificateTextModified[option] as string}
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
    </div>
  );
};

export default CertificateModeration;
