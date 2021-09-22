import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextArea, TextInput } from "hds-react";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationPhoto } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import { isTranslationTaskPhotoFieldValid } from "../../utils/translationValidation";
import PhotoPreviewTranslation from "./PhotoPreviewTranslation";
import TranslationSection from "./TranslationSection";

interface PhotosTranslationProps {
  prefix: string;
  buttonsPrefix?: string;
  index: number;
}

const PhotosTranslation = ({ prefix, buttonsPrefix, index }: PhotosTranslationProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();

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
    isTranslationTaskPhotoFieldValid(buttonsPrefix ?? prefix, index, evt.target.name, evt.target.name, translationExtra, dispatch);
  };

  return (
    <div>
      <div className="formSection">
        <PhotoPreviewTranslation index={index} />

        <div className="gridLayoutContainer translation">
          <TranslationSection
            id={`altText_${toOption}`}
            translateFrom={translateFrom}
            translateTo={translateTo}
            selectedValue={photosSelected[index] && (photosSelected[index].altText[fromOption] as string)}
            translatedValue={photosTranslated[index] && (photosTranslated[index].altText[toOption] as string)}
            taskType={taskType}
            taskStatus={taskStatus}
            helperText={i18n.t(`${prefix}.photos.altText.helperText`)}
            tooltipButtonLabel={i18n.t(`${buttonsPrefix ?? prefix}.button.openHelp`)}
            tooltipLabel={i18n.t(`${prefix}.photos.altText.tooltipLabel`)}
            tooltipText={i18n.t(`${prefix}.photos.altText.tooltipText`)}
            changeCallback={(evt: ChangeEvent<HTMLTextAreaElement>) => updatePhotoAltText(evt)}
            TranslationComponent={<TextArea id={`altText_${toOption}`} rows={3} label={i18n.t(`${prefix}.photos.altText.label`)} name={toOption} />}
          />

          <TranslationSection
            id={`source_${index}`}
            translateFrom={translateFrom}
            translateTo={translateTo}
            selectedValue={photosSelected[index] && photosSelected[index].source}
            translatedValue={photosTranslated[index] && photosTranslated[index].source}
            taskType={taskType}
            taskStatus={taskStatus}
            tooltipButtonLabel={i18n.t(`${buttonsPrefix ?? prefix}.button.openHelp`)}
            tooltipLabel={i18n.t(`${prefix}.photos.source.tooltipLabel`)}
            tooltipText={i18n.t(`${prefix}.photos.source.tooltipText`)}
            changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(evt)}
            blurCallback={validatePhoto}
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

PhotosTranslation.defaultProps = {
  buttonsPrefix: undefined,
};

export default PhotosTranslation;
