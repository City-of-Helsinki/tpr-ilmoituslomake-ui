import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup, TextArea, TextInput } from "hds-react";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationRequest } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";

const RequestDetail = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { language, translator, message } = requestDetail;
  const { from: translateFrom, to: translateTo } = language;
  const { name: translatorName, email: translatorEmail } = translator;
  const translationLanguage = translateFrom && translateTo ? `${translateFrom}-${translateTo}` : "";

  const updateRequestDetail = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, [evt.target.name]: evt.target.value }));
  };

  const updateRequestLanguage = (evt: ChangeEvent<HTMLInputElement>) => {
    const languageParts = evt.target.value.split("-");
    dispatch(setModerationTranslationRequest({ ...requestDetail, [evt.target.name]: { from: languageParts[0], to: languageParts[1] } }));
  };

  const updateRequestMessage = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setModerationTranslationRequest({ ...requestDetail, [evt.target.name]: evt.target.value }));
  };

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.translationDetails")}</h2>

      <div>
        <TextInput
          id="translatorName"
          className="formInput"
          label={i18n.t("moderation.translation.request.translatorName.label")}
          name="translatorName"
          value={translatorName}
          onChange={updateRequestDetail}
        />

        <TextInput
          id="translatorEmail"
          className="formInput"
          label={i18n.t("moderation.translation.request.translatorEmail.label")}
          name="translatorName"
          value={translatorEmail}
          onChange={updateRequestDetail}
        />

        <SelectionGroup
          id="translationLanguage"
          direction="horizontal"
          className="formInput"
          label={i18n.t("moderation.translation.request.translationLanguage.label")}
        >
          <RadioButton
            id="translationLanguage_en_zh"
            label="EN-ZH"
            name="language"
            value="en-zh"
            checked={translationLanguage === "en-zh"}
            onChange={updateRequestLanguage}
          />
        </SelectionGroup>

        <TextArea
          id="message"
          className="formInput"
          label={i18n.t("moderation.translation.request.message.label")}
          name="message"
          value={message}
          onChange={updateRequestMessage}
        />
      </div>
    </div>
  );
};

export default RequestDetail;
