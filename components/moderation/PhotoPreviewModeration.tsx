import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/reducers";
import { ModerationStatus, TaskType } from "../../types/constants";
import styles from "./PhotoPreviewModeration.module.scss";

interface PhotoPreviewModerationProps {
  index: number;
}

const PhotoPreviewModeration = ({ index }: PhotoPreviewModerationProps): ReactElement => {
  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photosSelected, photosModified, taskType } = moderationExtra;
  const { preview: previewSelected } = photosSelected[index] || {};
  const { preview: previewModified } = photosModified[index] || {};

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { photos: photosStatus } = moderationStatus;
  const { url: photoStatus } = photosStatus[index] || {};

  if (taskType === TaskType.RemoveTip || taskType === TaskType.ModeratorRemove || taskType === TaskType.PlaceInfo) {
    return (
      <div className="gridLayoutContainer moderation">
        <div className={`${styles.gridSelected} ${styles.imagePreview}`}>
          <img src={photoStatus !== ModerationStatus.Edited ? previewSelected : previewModified} alt="" />
        </div>
      </div>
    );
  }

  if (
    taskType === TaskType.NewPlace ||
    taskType === TaskType.PlaceChange ||
    taskType === TaskType.ChangeTip ||
    taskType === TaskType.AddTip ||
    taskType === TaskType.ModeratorChange ||
    taskType === TaskType.ModeratorAdd
  ) {
    return (
      <div className="gridLayoutContainer moderation">
        <div className={`${styles.gridSelected} ${styles.imagePreview}`}>
          <img src={previewSelected} alt="" />
        </div>
        <div className={`${styles.gridModified} ${styles.imagePreview}`}>
          <img src={previewModified} alt="" />
        </div>
        <div className={styles.gridActionButton} />
      </div>
    );
  }

  return <></>;
};

export default PhotoPreviewModeration;
