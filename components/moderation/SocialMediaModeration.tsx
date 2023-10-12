import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconPlus, Notification as HdsNotification, TextInput } from "hds-react";
import { v4 as uuidv4 } from "uuid";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { removeModerationSocialMedia, setModerationSocialMedia } from "../../state/actions/moderation";
import { removeModerationSocialMediaStatus, setModerationSocialMediaStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, TaskStatus, TaskType } from "../../types/constants";
import { SocialMediaStatus } from "../../types/moderation_status";
import ModerationSection from "./ModerationSection";
import styles from "./SocialMediaModeration.module.scss";

const SocialMediaModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { social_media: socialMediaSelected = [] } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { social_media: socialMediaModified = [] } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus, socialMediaUuids } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { socialMedia: socialMediaStatus } = moderationStatus;

  const pageStatus = useSelector((state: RootState) => state.moderationStatus.pageStatus);

  const updateSocialMedia = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationSocialMedia(index, { ...socialMediaModified[index], [evt.target.name]: evt.target.value }));
  };

  const addSocialMediaItem = () => {
    dispatch(
      setModerationSocialMedia(-1, {
        uuid: uuidv4(),
        title: "",
        link: "",
        new: true,
      })
    );
    dispatchStatus(
      setModerationSocialMediaStatus(-1, {
        title: ModerationStatus.Edited,
        link: ModerationStatus.Edited,
      } as SocialMediaStatus)
    );
  };

  const removeSocialMediaItem = (index: number) => {
    dispatch(removeModerationSocialMedia(index));
    dispatchStatus(removeModerationSocialMediaStatus(index));
  };

  const updateSocialMediaStatus = (index: number, socialMediaField: string, status: ModerationStatus) => {
    dispatchStatus(setModerationSocialMediaStatus(index, { [socialMediaField]: status }));
  };

  return (
    <div>
      {socialMediaUuids.map((uuid, index) => {
        const key = `socialmedia_${index}`;
        const selectedSocialMediaItem = socialMediaSelected.find((sm) => sm.uuid === uuid);
        const modifiedSocialMediaItem = socialMediaModified.find((sm) => sm.uuid === uuid);

        return (
          <div key={key} className="formSection">
            <div className="gridLayoutContainer moderation">
              <ModerationSection
                id={`title_${index}`}
                fieldName="title"
                selectedValue={selectedSocialMediaItem?.title}
                modifiedValue={modifiedSocialMediaItem?.title}
                moderationStatus={socialMediaStatus[index].title}
                taskType={taskType}
                taskStatus={taskStatus}
                selectedHeaderText={`${i18n.t("moderation.links.socialMedia.label")} ${index + 1}${i18n.t("moderation.task.selected")}`}
                modifiedHeaderText={`${i18n.t("moderation.links.socialMedia.label")} ${index + 1}${i18n.t("moderation.task.modified")}`}
                modifyButtonHidden={!modifiedSocialMediaItem}
                actionButtonHidden={!modifiedSocialMediaItem}
                bypassModifiedFieldCheck={!modifiedSocialMediaItem}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateSocialMedia(index, evt)}
                statusCallback={(fieldName, status) => updateSocialMediaStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`title_${index}`} label={i18n.t("moderation.socialMedia.title.label")} name="title" />}
              />

              <ModerationSection
                id={`link_${index}`}
                fieldName="link"
                selectedValue={selectedSocialMediaItem?.link}
                modifiedValue={modifiedSocialMediaItem?.link}
                moderationStatus={socialMediaStatus[index].link}
                taskType={taskType}
                taskStatus={taskStatus}
                modifyButtonHidden={!modifiedSocialMediaItem}
                actionButtonHidden={!modifiedSocialMediaItem}
                bypassModifiedFieldCheck={!modifiedSocialMediaItem}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updateSocialMedia(index, evt)}
                statusCallback={(fieldName, status) => updateSocialMediaStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`link_${index}`} label={i18n.t("moderation.socialMedia.link.label")} name="link" />}
              />
            </div>

            {(taskType === TaskType.NewPlace ||
              taskType === TaskType.PlaceChange ||
              taskType === TaskType.ChangeTip ||
              taskType === TaskType.AddTip ||
              taskType === TaskType.ModeratorChange ||
              taskType === TaskType.ModeratorAdd ||
              pageStatus === ModerationStatus.Edited) && (
              <div className="gridLayoutContainer moderation">
                {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
                  <div className={styles.gridSelected}>
                    {!modifiedSocialMediaItem && (
                      <HdsNotification size="small" type="alert">
                        {i18n.t(`moderation.socialMedia.removed`)}
                      </HdsNotification>
                    )}
                  </div>
                )}
                <div
                  className={
                    taskType === TaskType.NewPlace ||
                    taskType === TaskType.PlaceChange ||
                    taskType === TaskType.ChangeTip ||
                    taskType === TaskType.AddTip ||
                    taskType === TaskType.ModeratorChange ||
                    taskType === TaskType.ModeratorAdd
                      ? styles.gridModified
                      : styles.gridSelected
                  }
                >
                  {modifiedSocialMediaItem && (
                    <Button
                      variant="secondary"
                      onClick={() => removeSocialMediaItem(index)}
                      disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
                    >
                      {i18n.t("moderation.socialMedia.remove")}
                    </Button>
                  )}
                </div>
                <div className={styles.gridActionButton} />
              </div>
            )}
            <hr />
          </div>
        );
      })}

      {(taskType === TaskType.NewPlace ||
        taskType === TaskType.PlaceChange ||
        taskType === TaskType.ChangeTip ||
        taskType === TaskType.AddTip ||
        taskType === TaskType.ModeratorChange ||
        taskType === TaskType.ModeratorAdd ||
        pageStatus === ModerationStatus.Edited) &&
        taskStatus !== TaskStatus.Closed &&
        taskStatus !== TaskStatus.Rejected &&
        taskStatus !== TaskStatus.Cancelled && (
          <div className={`gridLayoutContainer moderation ${styles.addNewContainer}`}>
            <div className={styles.gridSelected}>
              <div className={styles.gridButton}>
                <Button variant="secondary" iconLeft={<IconPlus aria-hidden />} onClick={() => addSocialMediaItem()}>
                  {i18n.t("moderation.socialMedia.addNew")}
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default SocialMediaModeration;
