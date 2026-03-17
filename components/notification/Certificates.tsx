import React, { ChangeEvent, Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Combobox, TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationCertificate, setNotificationOtherCertificate } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH } from "../../types/constants";
import { OptionType, CertificateOption } from "../../types/general";
import { sortByOptionLabel } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import { isCertificateValid } from "../../utils/validation";

const Certificates = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { certificate_ids } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { certificateOptions, extraKeywordsText, otherCertificates } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { certificate_ids: tagsValid } = notificationValidation;

  const convertOptions = (options: CertificateOption[]): OptionType[] => 
  options.map((tag) => ({ id: tag.id, label: tag.certificatename[router.locale || defaultLocale] as string }))
  .sort((a, b) => {
      if (a.id === -1) return 1; 
      if (b.id === -1) return -1; 

      return sortByOptionLabel(a, b);
    });

  const convertValues = (values: number[]): OptionType[] => convertOptions(certificateOptions.filter((tag) => values.includes(tag.id)));

  const updateCertificates = (selected: OptionType[]) => {
    dispatch(setNotificationCertificate(selected.map((s) => s.id as number)));

  };

  const updateOtherCertificate = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationOtherCertificate(router.locale || defaultLocale, evt.target.value));

  };

  const validateCertificates = () => {
    isCertificateValid(notification, dispatchValidation);
  };

  const other = notification.certificate_ids.includes(-1);

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.certificates.title")}</h3>
      <Combobox
        id="certificate"
        className="formInput"
        // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
        options={convertOptions(certificateOptions)}
        value={convertValues(certificate_ids)}
        onChange={updateCertificates}
        onBlur={validateCertificates}
        label={i18n.t("notification.certificates.add.label")}
        helper={i18n.t("notification.certificates.add.helperText")}
        toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
        selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
        clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        invalid={!tagsValid.valid}
        error={!tagsValid.valid ? i18n.t(tagsValid.message as string).replace("$fieldName", i18n.t("notification.certificates.certificateSelection")) : ""}
        multiselect
      />

      {other ? 
          (<>
            <TextInput
            id="otherCertificates"
            className="formInput"
            label={i18n.t("notification.certificates.extra")}
            helperText=""
            name="otherCertificates"
            value={otherCertificates[router.locale || defaultLocale] as string}
            maxLength={MAX_LENGTH}
            onChange={updateOtherCertificate}
          />
          </>) : 
          ("")
      }
      
    </div>
  );
};

export default Certificates;
