import React, { ChangeEvent, Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { useMediaQuery } from "react-responsive";
import { Combobox, TextInput, SelectionGroup, Checkbox } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import {
  setNotificationCertificate,
  setNotificationLabel,
  setNotificationOtherCertificate,
  setNotificationOtherCertificateUrl,
  setNotificationNoCertificate,
} from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH } from "../../types/constants";
import { OptionType, CertificateOption, LabelOptionType } from "../../types/general";
import { sortByOptionLabel } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import { isCertificateValid } from "../../utils/validation";
import styles from "./InputLanguage.module.scss";

const Certificates = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  // Note: this only works for client-side rendering
  const isScreenSizeXS = useMediaQuery({ query: `only screen and (max-width: ${styles.max_breakpoint_xs})` });

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { certificate_ids } = notification;
  const { label_ids } = notification;
  const { no_certificate } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { certificateOptions, otherCertificates, otherCertificatesUrl } = notificationExtra;

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

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { certificate_ids: tagsValid } = notificationValidation;

  const convertOptions = (options: CertificateOption[]): OptionType[] =>
    options
      .map((tag) => ({ id: tag.id, label: tag.certificatename[router.locale || defaultLocale] as string }))
      .sort((a, b) => {
        if (a.id === -1) return 1;
        if (b.id === -1) return -1;

        return sortByOptionLabel(a, b);
      });

  const checkedLabel = (id: number) => {
    if (label_ids.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

  const convertLabelOptions = (options: CertificateOption[]): LabelOptionType[] =>
    options
      .map((tag) => ({ id: tag.id, checked: checkedLabel(tag.id), label: tag.certificatename[router.locale || defaultLocale] as string }))
      .sort((a, b) => {
        if (a.id === -2) return 1;
        if (b.id === -2) return -1;

        return sortByOptionLabel(a, b);
      });

  const convertValues = (values: number[]): OptionType[] => convertOptions(certificateOptions.filter((tag) => values.includes(tag.id)));

  const updateCertificates = (selected: OptionType[]) => {
    dispatch(setNotificationCertificate(selected.map((s) => s.id as number)));
  };

  const updateLabelCertificate = (evt: ChangeEvent<HTMLInputElement>) => {
    const targetValue = Number(evt.target.value);
    let idList = label_ids;

    if (!idList.includes(targetValue)) {
      if (targetValue === -2) {
        idList = [];
      } else {
        idList = idList.filter((item) => item !== -2);
      }
      idList.push(targetValue);
    } else {
      idList = idList.filter((item) => item !== targetValue);
    }
    dispatch(setNotificationLabel(idList));
  };

  const updateOtherCertificate = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationOtherCertificate(router.locale || defaultLocale, evt.target.value));
  };

  const updateOtherCertificateUrl = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationOtherCertificateUrl(router.locale || defaultLocale, evt.target.value));
  };

  const updateNoCertificate = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationNoCertificate(!no_certificate));
  };

  const validateCertificates = () => {
    isCertificateValid(notification, dispatchValidation);
  };

  const other = notification.certificate_ids.includes(-1);

  const certificateSelected = notification.certificate_ids.length;

  const noCertificate = notification.no_certificate;

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.certificates.title")}</h3>
      <div className="labelSelection">
        <SelectionGroup
          id="certificateLabels"
          direction={isScreenSizeXS ? "vertical" : "horizontal"}
          className="formInput"
          label={i18n.t("notification.certificates.label")}
        >
          {convertLabelOptions(labelCertificates).map((option) => (
            <Checkbox
              id={`input_${option.id}`}
              key={`input_${option.id}`}
              label={option.label}
              name={option.id as string}
              value={option.id as string}
              checked={label_ids.includes(Number(option.id))}
              onChange={updateLabelCertificate}
            />
          ))}
        </SelectionGroup>
        {!certificateSelected ? (
          <>
            <SelectionGroup id="noCertificate" direction="horizontal" className="formInput" label={i18n.t("notification.certificates.noCertificate")}>
              <Checkbox
                id="noCertificateCheck"
                key="noCertificateCheck"
                label={i18n.t("notification.certificates.noCertificate")}
                name={i18n.t("notification.certificates.noCertificate")}
                value={i18n.t("notification.certificates.noCertificate")}
                checked={no_certificate}
                onChange={updateNoCertificate}
              />
            </SelectionGroup>
          </>
        ) : (
          ""
        )}
      </div>

      {!noCertificate ? (
        <>
          <Combobox
            id="certificate"
            className="formInput"
            // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
            options={convertOptions(mainCertificateOptions)}
            value={convertValues(certificate_ids)}
            onChange={updateCertificates}
            onBlur={validateCertificates}
            label={i18n.t("notification.certificates.add.label")}
            helper={i18n.t("notification.certificates.add.helperText")}
            toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
            selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
            clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
            invalid={!tagsValid.valid}
            error={
              !tagsValid.valid
                ? i18n.t(tagsValid.message as string).replace("$fieldName", i18n.t("notification.certificates.certificateSelection"))
                : ""
            }
            multiselect
            required={!no_certificate}
            aria-required={!no_certificate}
          />

          {other ? (
            <>
              <TextInput
                id="otherCertificates"
                className="formInput"
                label={i18n.t("notification.certificates.otherCertificate")}
                helperText=""
                name="otherCertificates"
                value={otherCertificates[router.locale || defaultLocale] as string}
                maxLength={MAX_LENGTH}
                onChange={updateOtherCertificate}
              />
              <TextInput
                id="otherCertificatesUrl"
                className="formInput"
                label={i18n.t("notification.certificates.otherCertificateUrl")}
                helperText=""
                name="otherCertificatesUrl"
                value={otherCertificatesUrl[router.locale || defaultLocale] as string}
                maxLength={MAX_LENGTH}
                onChange={updateOtherCertificateUrl}
              />
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Certificates;
