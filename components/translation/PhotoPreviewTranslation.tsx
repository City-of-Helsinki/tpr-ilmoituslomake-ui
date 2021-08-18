import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/reducers";
import { TaskType } from "../../types/constants";
import styles from "./PhotoPreviewTranslation.module.scss";

interface PhotoPreviewTranslationProps {
  index: number;
}

const PhotoPreviewTranslation = ({ index }: PhotoPreviewTranslationProps): ReactElement => {
  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const { photosSelected, taskType } = translationExtra;
  const { preview: previewTranslated } = photosSelected[index] || {};

  if (taskType === TaskType.Translation) {
    return (
      <div className="gridLayoutContainer translation">
        <div className={`gridColumn1 ${styles.imagePreview}`}>
          <img src={previewTranslated} alt="" />
        </div>
        <div className={`gridColumn2 ${styles.imagePreview}`} />
        <div className="gridColumn3" />
      </div>
    );
  }

  return <></>;
};

export default PhotoPreviewTranslation;
