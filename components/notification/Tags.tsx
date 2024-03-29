import React, { ChangeEvent, Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Combobox, TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationExtraKeywords, setNotificationTag } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH } from "../../types/constants";
import { OptionType, TagOption } from "../../types/general";
import { sortByOptionLabel } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import { isTagValid } from "../../utils/validation";

const Tags = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { ontology_ids } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { tagOptions, extraKeywordsText } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { ontology_ids: tagsValid } = notificationValidation;

  const convertOptions = (options: TagOption[]): OptionType[] =>
    options.map((tag) => ({ id: tag.id, label: tag.ontologyword[router.locale || defaultLocale] as string })).sort(sortByOptionLabel);

  const convertValues = (values: number[]): OptionType[] => convertOptions(tagOptions.filter((tag) => values.includes(tag.id)));

  const updateTags = (selected: OptionType[]) => {
    dispatch(setNotificationTag(selected.map((s) => s.id as number)));
  };

  const updateExtraKeywordsText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationExtraKeywords(router.locale || defaultLocale, evt.target.value));
  };

  const validateTags = () => {
    isTagValid(notification, dispatchValidation);
  };

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.tags.title")}</h3>
      <Combobox
        id="tag"
        className="formInput"
        // @ts-ignore: Erroneous error that the type for options should be OptionType[][]
        options={convertOptions(tagOptions)}
        value={convertValues(ontology_ids)}
        onChange={updateTags}
        onBlur={validateTags}
        label={i18n.t("notification.tags.add.label")}
        helper={i18n.t("notification.tags.add.helperText")}
        toggleButtonAriaLabel={i18n.t("notification.button.toggleMenu")}
        selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
        clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        invalid={!tagsValid.valid}
        error={!tagsValid.valid ? i18n.t(tagsValid.message as string).replace("$fieldName", i18n.t("notification.tags.tagSelection")) : ""}
        required
        aria-required
        multiselect
      />

      <TextInput
        id="extraKeywordsText"
        className="formInput"
        label={i18n.t("notification.tags.extraKeywords.label")}
        helperText={i18n.t("notification.tags.extraKeywords.helperText")}
        name="extraKeywordsText"
        value={extraKeywordsText[router.locale || defaultLocale] as string}
        maxLength={MAX_LENGTH}
        onChange={updateExtraKeywordsText}
      />
    </div>
  );
};

export default Tags;
