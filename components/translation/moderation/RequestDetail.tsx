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
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { language, translator, message, tasks } = requestDetail;
  const { from: translateFrom, to: translateTo } = language;
  const translationLanguage = translateFrom && translateTo ? `${translateFrom}-${translateTo}` : "";
  const taskStatus = useMemo(() => requestStatus(tasks), [requestStatus, tasks]);

  const requestValidation = useSelector((state: RootState) => state.moderationTranslation.requestValidation);
  const { translator: translatorValid, language: languageValid, message: messageValid } = requestValidation;

  const translators = useSelector((state: RootState) => state.moderationTranslation.translators);

  const languageOptions = TRANSLATION_OPTIONS.map((option) => {
    return { id: `${option.from}-${option.to}`, label: `${option.from.toUpperCase()}-${option.to.toUpperCase()}` };
  });

  const translatorOptions = translators.map((option) => {
    return { id: option.uuid, label: `${option.first_name} ${option.last_name}` };
  });

  const convertValueWithLanguageId = (value: string | undefined): OptionType | undefined => languageOptions.find((l) => l.id === value);

  const convertValueWithTranslatorId = (value: string | undefined): OptionType | undefined => translatorOptions.find((l) => l.id === value);

  const updateRequestTranslator = (selected: OptionType) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, translator: selected.id as string }));
  };

  const updateRequestLanguage = (selected: OptionType) => {
    const languageParts = (selected.id as string).split("-");
    dispatch(setModerationTranslationRequest({ ...requestDetail, language: { from: languageParts[0], to: languageParts[1] } }));
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

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.translationDetails")}</h2>

      <div className={styles.requestDetail}>
        <Select
          id="translator"
          className="formInput disabledTextColor"
          options={translatorOptions}
          value={convertValueWithTranslatorId(translator)}
          onChange={updateRequestTranslator}
          onBlur={validateRequestTranslator}
          label={i18n.t("moderation.translation.request.translator.label")}
          selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
          clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
          invalid={!translatorValid.valid}
          error={
            !translatorValid.valid
              ? i18n.t(translatorValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.translator.label"))
              : ""
          }
          required
          aria-required
          disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
        />

        <Select
          id="translationLanguage"
          className="formInput disabledTextColor"
          options={languageOptions}
          value={convertValueWithLanguageId(translationLanguage)}
          onChange={updateRequestLanguage}
          onBlur={validateRequestTranslationLanguage}
          label={i18n.t("moderation.translation.request.translationLanguage.label")}
          selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
          clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
          invalid={!languageValid.valid}
          error={
            !languageValid.valid
              ? i18n.t(languageValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.translationLanguage.label"))
              : ""
          }
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
              ? i18n.t(messageValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.message.label"))
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
