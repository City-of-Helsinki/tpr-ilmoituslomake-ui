import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextArea, TextInput } from "hds-react";
import { TranslationAction } from "../../state/actions/translationTypes";
import { TranslationStatusAction } from "../../state/actions/translationStatusTypes";
import { setTranslationPhoto } from "../../state/actions/translation";
import { setTranslationPhotoAltTextStatus, setTranslationPhotoStatus } from "../../state/actions/translationStatus";
import { RootState } from "../../state/reducers";
import { TranslationStatus } from "../../types/constants";
import { isTranslationTaskPhotoFieldValid } from "../../utils/translationValidation";
import PhotoPreviewTranslation from "./PhotoPreviewTranslation";
import TranslationSection from "./TranslationSection";

interface PhotosTranslationProps {
  prefix: string;
  index: number;
}

const PhotosTranslation = ({ prefix, index }: PhotosTranslationProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();
  const dispatchStatus = useDispatch<Dispatch<TranslationStatusAction>>();

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    photosSelected,
    photosTranslated,
    translationRequest: {
      language: { from: translateFrom, to: translateTo },
    },
    translationTask: { taskType, taskStatus },
  } = translationExtra;

  const taskValidation = useSelector((state: RootState) => state.translation.taskValidation);
  const { photos: photosValid } = taskValidation;

  const translationStatus = useSelector((state: RootState) => state.translationStatus.translationStatus);
  const { photos: photosStatus } = translationStatus;

  const fromOption = "en";
  const toOption = "lang";

  const updatePhoto = (evt: ChangeEvent<HTMLInputElement>) => {
    const fieldName = evt.target.name.indexOf("permission") >= 0 ? "permission" : evt.target.name;
    dispatch(setTranslationPhoto(index, { ...photosTranslated[index], [fieldName]: evt.target.value }));
  };

  const updatePhotoAltText = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setTranslationPhoto(index, { ...photosTranslated[index], altText: { ...photosTranslated[index].altText, [evt.target.name]: evt.target.value } })
    );
  };

  const validatePhoto = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setTranslationPhoto(index, { ...photosTranslated[index], [evt.target.name]: (photosTranslated[index][evt.target.name] as string).trim() })
    );
    isTranslationTaskPhotoFieldValid(prefix, index, evt.target.name, evt.target.name, translationExtra, dispatch);
  };

  const updatePhotoTranslationStatus = (photoField: string, status: TranslationStatus) => {
    dispatchStatus(setTranslationPhotoStatus(index, { [photoField]: status }));
  };

  const updatePhotoAltTextStatus = (language: string, status: TranslationStatus) => {
    dispatchStatus(setTranslationPhotoAltTextStatus(index, { [language]: status }));
  };

  return (
    <div>
      <div className="formSection">
        <PhotoPreviewTranslation index={index} />

        <div className="gridLayoutContainer translation">
          <TranslationSection
            id={`altText_${toOption}`}
            prefix={prefix}
            fieldName={toOption}
            translateFrom={translateFrom}
            translateTo={translateTo}
            selectedValue={photosSelected[index] && (photosSelected[index].altText[fromOption] as string)}
            translatedValue={photosTranslated[index] && (photosTranslated[index].altText[toOption] as string)}
            translationStatus={photosStatus[index].altText[toOption]}
            taskType={taskType}
            taskStatus={taskStatus}
            helperText={i18n.t(`${prefix}.photos.altText.helperText`)}
            tooltipButtonLabel={i18n.t(`${prefix}.button.openHelp`)}
            tooltipLabel={i18n.t(`${prefix}.photos.altText.tooltipLabel`)}
            tooltipText={i18n.t(`${prefix}.photos.altText.tooltipText`)}
            modifyButtonLabel={i18n.t(`${prefix}.photos.altText.label`)}
            changeCallback={(evt: ChangeEvent<HTMLTextAreaElement>) => updatePhotoAltText(evt)}
            statusCallback={(language, status) => updatePhotoAltTextStatus(language, status)}
            TranslationComponent={<TextArea id={`altText_${toOption}`} rows={3} label={i18n.t(`${prefix}.photos.altText.label`)} name={toOption} />}
          />

          <TranslationSection
            id={`source_${index}`}
            prefix={prefix}
            fieldName="source"
            translateFrom={translateFrom}
            translateTo={translateTo}
            selectedValue={photosSelected[index] && photosSelected[index].source}
            translatedValue={photosTranslated[index] && photosTranslated[index].source}
            translationStatus={photosStatus[index].source}
            taskType={taskType}
            taskStatus={taskStatus}
            tooltipButtonLabel={i18n.t(`${prefix}.button.openHelp`)}
            tooltipLabel={i18n.t(`${prefix}.photos.source.tooltipLabel`)}
            tooltipText={i18n.t(`${prefix}.photos.source.tooltipText`)}
            modifyButtonLabel={i18n.t(`${prefix}.photos.source.label`)}
            changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(evt)}
            blurCallback={validatePhoto}
            statusCallback={(fieldName, status) => updatePhotoTranslationStatus(fieldName, status)}
            invalid={!photosValid[index].source.valid}
            errorText={
              !photosValid[index].source.valid
                ? i18n.t(photosValid[index].source.message as string).replace("$fieldName", i18n.t(`${prefix}.photos.source.label`))
                : ""
            }
            required
            TranslationComponent={<TextInput id={`source_${index}`} label={i18n.t(`${prefix}.photos.source.label`)} name="source" />}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotosTranslation;
