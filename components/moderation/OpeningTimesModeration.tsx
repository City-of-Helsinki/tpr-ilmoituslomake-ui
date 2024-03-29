import React, { Dispatch, ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationOpeningTimesId } from "../../state/actions/moderation";
import { setModerationOpeningTimesStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, TaskType } from "../../types/constants";
import { OpeningTimeResult, OpeningTimeResults } from "../../types/general";
import getOrigin from "../../utils/request";
import OpeningTimesText from "../common/OpeningTimesText";
import ActionButton from "./ActionButton";
import OpeningTimesButtonModeration from "./OpeningTimesButtonModeration";
import styles from "./OpeningTimesModeration.module.scss";

const OpeningTimesModeration = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus, openingTimesNotificationId } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { openingTimes: openingTimesStatus } = moderationStatus;

  const [openingTimesSelected, setOpeningTimesSelected] = useState<OpeningTimeResult[]>([]);
  const [openingTimesModified, setOpeningTimesModified] = useState<OpeningTimeResult[]>([]);

  const isOpeningTimesChanged = (selectedTimes: OpeningTimeResult[], modifiedTimes: OpeningTimeResult[]) => {
    return (
      selectedTimes.length !== modifiedTimes.length ||
      (selectedTimes.length > 0 &&
        modifiedTimes.length > 0 &&
        (selectedTimes[0].date_periods_as_text.fi !== modifiedTimes[0].date_periods_as_text.fi ||
          selectedTimes[0].date_periods_as_text.sv !== modifiedTimes[0].date_periods_as_text.sv ||
          selectedTimes[0].date_periods_as_text.en !== modifiedTimes[0].date_periods_as_text.en))
    );
  };

  const updateOpeningTimesStatus = (fieldName: string, status: ModerationStatus) => {
    dispatchStatus(setModerationOpeningTimesStatus(status));

    // Only store the hauki id if approved so that backend knows the status
    // Also don't set the hauki id for change requests and moderator edits, since there are no draft opening times in this case
    if (
      taskType === TaskType.ChangeTip ||
      taskType === TaskType.AddTip ||
      taskType === TaskType.ModeratorChange ||
      taskType === TaskType.ModeratorAdd
    ) {
      dispatch(setModerationOpeningTimesId(0));
    } else if (status === ModerationStatus.Approved) {
      const haukiId = openingTimesModified.length > 0 ? openingTimesModified[0].resource.id : 0;
      dispatch(setModerationOpeningTimesId(haukiId));
    } else {
      dispatch(setModerationOpeningTimesId(0));
    }
  };

  const fetchOpeningTimes = async (taskId: string) => {
    const openingTimesResponse = await fetch(`${getOrigin(router)}/api/openingtimes/get/${taskId}/`);
    if (openingTimesResponse.ok) {
      const openingTimesResults = await (openingTimesResponse.json() as Promise<OpeningTimeResults>);

      console.log("OPENING TIMES RESPONSE", taskId, openingTimesResults);

      return openingTimesResults.results || [];
    }
  };

  const getOpeningTimesOnMount = async () => {
    const placeId = String(selectedTaskId);
    const draftId =
      taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.ModeratorChange || taskType === TaskType.ModeratorAdd
        ? `${selectedTaskId}`
        : `ilmoitus-${openingTimesNotificationId}`;

    const selectedTimes = (await fetchOpeningTimes(placeId)) || [];
    const modifiedTimes = (await fetchOpeningTimes(draftId)) || [];
    setOpeningTimesSelected(selectedTimes);
    setOpeningTimesModified(modifiedTimes);

    // Enable the modified opening times to be edited by default if they are different from the selected opening times
    let initialStatus = openingTimesStatus;
    if (openingTimesStatus === ModerationStatus.Unknown) {
      if (isOpeningTimesChanged(selectedTimes, modifiedTimes)) {
        initialStatus = ModerationStatus.Edited;
      } else {
        initialStatus = ModerationStatus.Approved;
      }
    }

    if (
      taskType === TaskType.NewPlace ||
      taskType === TaskType.PlaceChange ||
      taskType === TaskType.ChangeTip ||
      taskType === TaskType.AddTip ||
      taskType === TaskType.ModeratorChange ||
      taskType === TaskType.ModeratorAdd
    ) {
      // Enable the opening times to be edited by default
      updateOpeningTimesStatus("", initialStatus);
    }

    if (initialStatus === ModerationStatus.Approved) {
      const haukiId = modifiedTimes.length > 0 ? modifiedTimes[0].resource.id : 0;
      dispatch(setModerationOpeningTimesId(haukiId));
    }
  };

  // Get the opening times on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(getOpeningTimesOnMount);

  if (taskType === TaskType.RemoveTip || taskType === TaskType.ModeratorRemove || taskType === TaskType.PlaceInfo) {
    return (
      <div className="formSection">
        <div className="gridLayoutContainer moderation">
          {openingTimesStatus !== ModerationStatus.Edited && (
            <h4 className={`${styles.gridSelected} moderation`}>{`${i18n.t("moderation.openingTimes.title")}${i18n.t(
              "moderation.task.selected"
            )}`}</h4>
          )}
          {openingTimesStatus === ModerationStatus.Edited && (
            <h4 className={`${styles.gridModified} moderation`}>{`${i18n.t("moderation.openingTimes.title")}${i18n.t(
              "moderation.task.modified"
            )}`}</h4>
          )}

          <div className={styles.gridSelected}>
            <OpeningTimesText openingTimes={openingTimesSelected} />
          </div>
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
      <div className="formSection">
        <div className="gridLayoutContainer moderation">
          <h4 className={`${styles.gridSelected} moderation`}>{`${i18n.t("moderation.openingTimes.title")}${i18n.t("moderation.task.selected")}`}</h4>
          <h4 className={`${styles.gridModified} moderation`}>{`${i18n.t("moderation.openingTimes.title")}${i18n.t("moderation.task.modified")}`}</h4>

          <div className={styles.gridSelected}>
            <OpeningTimesText openingTimes={openingTimesSelected} />
          </div>
          <div className={styles.gridModified}>
            <OpeningTimesText openingTimes={openingTimesModified} />
          </div>
          <ActionButton
            className={styles.gridActionButton}
            fieldName="openingTimes"
            moderationStatus={openingTimesStatus}
            taskStatus={taskStatus}
            actionCallback={updateOpeningTimesStatus}
          />

          <div className={styles.gridModified}>
            <OpeningTimesButtonModeration buttonTextKey="moderation.button.modifyOpeningTimes" buttonVariant="secondary" />
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default OpeningTimesModeration;
