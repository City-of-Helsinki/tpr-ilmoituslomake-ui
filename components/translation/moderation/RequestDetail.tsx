import React, { Dispatch, ChangeEvent, ReactElement, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Select, TextArea, TextInput } from "hds-react";
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
  const { name: translatorName, email: translatorEmail } = translator;
  const translationLanguage = translateFrom && translateTo ? `${translateFrom}-${translateTo}` : "";
  const taskStatus = useMemo(() => requestStatus(tasks), [requestStatus, tasks]);

  const requestValidation = useSelector((state: RootState) => state.moderationTranslation.requestValidation);
  const {
    translatorName: translatorNameValid,
    translatorEmail: translatorEmailValid,
    language: languageValid,
    message: messageValid,
  } = requestValidation;

  const languageOptions = TRANSLATION_OPTIONS.map((option) => {
    return { id: `${option.from}-${option.to}`, label: `${option.from.toUpperCase()}-${option.to.toUpperCase()}` };
  });

  const convertValueWithId = (value: string | undefined): OptionType | undefined => languageOptions.find((l) => l.id === value);

  const updateRequestTranslatorDetail = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, translator: { ...requestDetail.translator, [evt.target.name]: evt.target.value } }));
  };

  const updateRequestLanguage = (selected: OptionType) => {
    const languageParts = (selected.id as string).split("-");
    dispatch(setModerationTranslationRequest({ ...requestDetail, language: { from: languageParts[0], to: languageParts[1] } }));
  };

  const updateRequestMessage = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, [evt.target.name]: evt.target.value }));
  };

  const validateRequestTranslatorDetail = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setModerationTranslationRequest({
        ...requestDetail,
        translator: { ...requestDetail.translator, [evt.target.name]: (translator[evt.target.name] as string).trim() },
      })
    );
    isModerationTranslationRequestFieldValid(evt.target.name, evt.target.id, requestDetail, dispatch);
  };

  const validateRequestMessageDetail = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, [evt.target.name]: message.trim() }));
    isModerationTranslationRequestFieldValid(evt.target.name, evt.target.id, requestDetail, dispatch);
  };

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.translationDetails")}</h2>

      <div className={styles.requestDetail}>
        <TextInput
          id="translatorName"
          className="formInput"
          label={i18n.t("moderation.translation.request.translatorName.label")}
          name="name"
          value={translatorName}
          onChange={updateRequestTranslatorDetail}
          onBlur={validateRequestTranslatorDetail}
          invalid={!translatorNameValid.valid}
          errorText={
            !translatorNameValid.valid
              ? i18n.t(translatorNameValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.translatorName.label"))
              : ""
          }
          required
          aria-required
          disabled={taskStatus === TaskStatus.Closed}
        />

        <TextInput
          id="translatorEmail"
          className="formInput"
          label={i18n.t("moderation.translation.request.translatorEmail.label")}
          name="email"
          value={translatorEmail}
          onChange={updateRequestTranslatorDetail}
          onBlur={validateRequestTranslatorDetail}
          invalid={!translatorEmailValid.valid}
          errorText={
            !translatorEmailValid.valid
              ? i18n.t(translatorEmailValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.translatorEmail.label"))
              : ""
          }
          required
          aria-required
          disabled={taskStatus === TaskStatus.Closed}
        />

        <Select
          id="translationLanguage"
          className="formInput"
          options={languageOptions}
          value={convertValueWithId(translationLanguage)}
          onChange={updateRequestLanguage}
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
          disabled={taskStatus === TaskStatus.Closed}
        />

        <TextArea
          id="message"
          className="formInput"
          label={i18n.t("moderation.translation.request.message.label")}
          name="message"
          value={message}
          onChange={updateRequestMessage}
          onBlur={validateRequestMessageDetail}
          invalid={!messageValid.valid}
          errorText={
            !messageValid.valid
              ? i18n.t(messageValid.message as string).replace("$fieldName", i18n.t("moderation.translation.request.message.label"))
              : ""
          }
          required
          aria-required
          disabled={taskStatus === TaskStatus.Closed}
        />
      </div>
    </div>
  );
};

export default RequestDetail;
