import React, { Dispatch, ChangeEvent, ReactElement, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Select, TextArea } from "hds-react";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationRequest } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { TaskStatus, TRANSLATION_OPTIONS } from "../../../types/constants";
import { ModerationTranslationRequestResultTask, OptionType } from "../../../types/general";
import { isModerationTranslationRequestFieldValid } from "../../../utils/moderationValidation";
import styles from "./RequestDetail.module.scss";

interface RequestDetailProps {
  requestStatus: (tasks: ModerationTranslationRequestResultTask[]) => TaskStatus;
}

const RequestDetail = ({ requestStatus }: RequestDetailProps): ReactElement => {
  const i18n = useI18n();
  //const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const dispatch = useDispatch();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { language, translator, message, tasks } = requestDetail;
  const { from: translateFrom, to: translateTo } = language;
  const translationLanguage = translateFrom && translateTo ? `${translateFrom}-${translateTo}` : undefined;
  const taskStatus = useMemo(() => requestStatus(tasks), [requestStatus, tasks]);

  const requestValidation = useSelector((state: RootState) => state.moderationTranslation.requestValidation);
  const { translator: translatorValid, language: languageValid, message: messageValid } = requestValidation;

  const translators = useSelector((state: RootState) => state.moderationTranslation.translators);

  const languageOptions = TRANSLATION_OPTIONS.map((option) => {
    return { value: `${option.from}-${option.to}`, label: `${option.from.toUpperCase()}-${option.to.toUpperCase()}` };
  });

  const translatorOptions = translators.map((option) => {
    return { value: option.uuid, label: `${option.first_name} ${option.last_name}` };
  });

  //const convertValueWithLanguageId = (value: string | undefined): OptionType | undefined => languageOptions.find((l) => l.value === value);

  //const convertValueWithTranslatorId = (value: string | undefined): OptionType | undefined => translatorOptions.find((l) => l.value === value);

  const updateRequestTranslator = (selectedOptions: OptionType[]) => {
    const selected = selectedOptions?.[0];
    if (selected) {
      dispatch(setModerationTranslationRequest({ ...requestDetail, translator: selected.value as string }));
    }
  };

  const updateRequestLanguage = (selectedOptions: OptionType[]) => {
    const selected = selectedOptions?.[0];
    if (selected) {
      const languageParts = (selected.value as string).split("-");
      dispatch(setModerationTranslationRequest({ ...requestDetail, language: { from: languageParts[0], to: languageParts[1] } }));
    }
  };

  const updateRequestMessage = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, [evt.target.name]: evt.target.value }));
  };

  const validateRequestTranslator = () => {
    isModerationTranslationRequestFieldValid("translator", "translator", requestDetail, dispatch);
  };

  const validateRequestTranslationLanguage = () => {
    isModerationTranslationRequestFieldValid("language", "language", requestDetail, dispatch);
  };

  const validateRequestMessage = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, [evt.target.name]: message.trim() }));
    isModerationTranslationRequestFieldValid(evt.target.name, evt.target.id, requestDetail, dispatch);
  };

  const translatorValidError = translatorValid.message ? i18n.t(translatorValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.translator.label")) : i18n.t("moderation.translation.request.translator.label");

  const languageValidError = languageValid.message ? i18n.t(languageValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.translationLanguage.label")) : i18n.t("moderation.translation.request.translationLanguage.label");

  const messageValidError = messageValid.message ? i18n.t(messageValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.message.label")) : i18n.t("moderation.translation.request.message.label");

  console.log("translatr  options", translators);

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.translationDetails")}</h2>

      <div className={styles.requestDetail}>
        <Select
          id="translator"
          className="formInput disabledTextColor"
          options={translatorOptions}
          value={translator}
          onChange={updateRequestTranslator}
          onBlur={validateRequestTranslator}
          texts={{
            label: i18n.t("moderation.translation.request.translator.label"),
            tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
            tagsClearAllButton: i18n.t("moderation.button.clearAllSelections"),
            error: translatorValid.valid
              ? translatorValidError
              : ""
          }}
          invalid={!translatorValid.valid}
          required
          aria-required
          disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
        />

        <Select
          id="translationLanguage"
          className="formInput disabledTextColor"
          options={languageOptions}
          value={translationLanguage}
          onChange={updateRequestLanguage}
          onBlur={validateRequestTranslationLanguage}
          texts={{
            label: i18n.t("moderation.translation.request.translationLanguage.label"),
            tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
            tagsClearAllButton: i18n.t("moderation.button.clearAllSelections"),
            error: !languageValid.valid ? languageValidError : ""
          }}
          invalid={!languageValid.valid}
          required
          aria-required
          disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
        />

        <TextArea
          id="message"
          className="formInput disabledTextColor"
          label={i18n.t("moderation.translation.request.message.label")}
          name="message"
          value={message}
          onChange={updateRequestMessage}
          onBlur={validateRequestMessage}
          invalid={!messageValid.valid}
          errorText={
            !messageValid.valid
              ? messageValidError
              : ""
          }
          required
          aria-required
          disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
        />
      </div>
    </div>
  );
};

export default RequestDetail;
