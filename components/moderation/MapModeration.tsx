import React, { Dispatch, ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { Button, IconPlaybackNext } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationLocation } from "../../state/actions/moderation";
import { setModerationLocationStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, TaskStatus, TaskType, MAP_INITIAL_CENTER, MAP_INITIAL_MARKER_ZOOM, MAP_INITIAL_ZOOM } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";
import styles from "./MapModeration.module.scss";

const MapWrapper = dynamic(() => import("../common/MapWrapper"), { ssr: false });

const MapModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { location: locationSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { location: locationModified } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { location: locationStatus } = moderationStatus;

  const initialCenter = MAP_INITIAL_CENTER;
  const initialSelectedZoom =
    locationSelected && locationSelected.length === 2 && locationSelected[0] > 0 && locationSelected[1] > 0
      ? MAP_INITIAL_MARKER_ZOOM
      : MAP_INITIAL_ZOOM;
  const initialModifiedZoom =
    locationModified && locationModified.length === 2 && locationModified[0] > 0 && locationModified[1] > 0
      ? MAP_INITIAL_MARKER_ZOOM
      : MAP_INITIAL_ZOOM;

  const isLocationValid = (location: [number, number]) => location && location.length === 2 && location[0] > 0 && location[1] > 0;

  const isLocationChanged = () => {
    return (
      isLocationValid(locationSelected) &&
      isLocationValid(locationModified) &&
      locationSelected[0] !== locationModified[0] &&
      locationSelected[1] !== locationModified[1]
    );
  };

  const updateLocation = (coordinates: [number, number]) => {
    dispatch(setModerationLocation(coordinates));
  };

  // useCallback is required here since updateLocationStatus is a dependency in useEffect below
  const updateLocationStatus = useCallback(
    (fieldName: string, status: ModerationStatus) => {
      dispatchStatus(setModerationLocationStatus(status));
    },
    [dispatchStatus]
  );

  const [map2Ready, setMap2Ready] = useState<boolean>(false);

  // Enable the modified location to be edited by default if it is different from the selected location
  // For tip change requests about new places, enable the location to be edited by default
  let initialStatus = locationStatus;
  if (locationStatus === ModerationStatus.Unknown) {
    if (
      !isLocationValid(locationSelected) ||
      !isLocationValid(locationModified) ||
      isLocationChanged() ||
      taskType === TaskType.AddTip ||
      taskType === TaskType.ModeratorAdd
    ) {
      initialStatus = ModerationStatus.Edited;
    } else if (isLocationValid(locationSelected) || isLocationValid(locationModified)) {
      initialStatus = ModerationStatus.Approved;
    }
  }
  const [initialLocationStatus, setInitialLocationStatus] = useState<ModerationStatus | undefined>(initialStatus);

  useEffect(() => {
    if (
      taskType === TaskType.NewPlace ||
      taskType === TaskType.PlaceChange ||
      taskType === TaskType.ChangeTip ||
      taskType === TaskType.AddTip ||
      taskType === TaskType.ModeratorChange ||
      taskType === TaskType.ModeratorAdd
    ) {
      if (map2Ready && initialLocationStatus) {
        // Enable the location to be edited by default
        updateLocationStatus("", initialLocationStatus);
        setInitialLocationStatus(undefined);
      }
    }
  }, [taskType, map2Ready, initialLocationStatus, setInitialLocationStatus, updateLocationStatus]);

  if (taskType === TaskType.RemoveTip || taskType === TaskType.ModeratorRemove || taskType === TaskType.PlaceInfo) {
    const skipMap = () => {
      window.location.href = "#contact";
    };

    return (
      <div className="formSection">
        <div className="gridLayoutContainer moderation">
          {locationStatus !== ModerationStatus.Edited && (
            <h4 className={`${styles.gridSelected} moderation`}>{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.selected")}`}</h4>
          )}
          {locationStatus === ModerationStatus.Edited && (
            <h4 className={`${styles.gridSelected} moderation`}>{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.modified")}`}</h4>
          )}

          <div className={styles.gridSelected}>
            <Button
              variant="supplementary"
              size="small"
              className="visibleOnFocusOnly"
              iconRight={<IconPlaybackNext aria-hidden />}
              onClick={skipMap}
            >
              {i18n.t("moderation.map.skipMap")}
            </Button>
          </div>

          <MapWrapper
            id="map"
            className={`${styles.gridSelected} ${styles.map}`}
            initialCenter={initialCenter as [number, number]}
            initialZoom={locationStatus !== ModerationStatus.Edited ? initialSelectedZoom : initialModifiedZoom}
            location={locationStatus !== ModerationStatus.Edited ? locationSelected : locationModified}
            setLocation={locationStatus === ModerationStatus.Edited ? updateLocation : undefined}
            draggableMarker={locationStatus === ModerationStatus.Edited && taskStatus !== TaskStatus.Closed && taskStatus !== TaskStatus.Cancelled}
          />
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
    const skipMap = () => {
      window.location.href = "#mapaction";
    };

    return (
      <div className="formSection">
        <div className="gridLayoutContainer moderation">
          <h4 className={`${styles.gridSelected} moderation`}>{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.selected")}`}</h4>
          <h4 className={`${styles.gridModified} moderation`}>{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.modified")}`}</h4>

          <div className={styles.gridSelected}>
            <Button
              variant="supplementary"
              size="small"
              className="visibleOnFocusOnly"
              iconRight={<IconPlaybackNext aria-hidden />}
              onClick={skipMap}
            >
              {i18n.t("moderation.map.skipMap")}
            </Button>
          </div>

          <MapWrapper
            id="map1"
            className={`${styles.gridSelected} ${styles.map}`}
            initialCenter={initialCenter as [number, number]}
            initialZoom={initialSelectedZoom}
            location={locationSelected}
            draggableMarker={false}
          />

          <ModifyButton
            className={styles.gridModified}
            label={i18n.t("moderation.map.title")}
            fieldName="location"
            moderationStatus={initialLocationStatus || locationStatus}
            taskStatus={taskStatus}
            modifyCallback={updateLocationStatus}
          >
            <MapWrapper
              id="map2"
              className={`${styles.gridModified} ${styles.map}`}
              initialCenter={initialCenter as [number, number]}
              initialZoom={initialModifiedZoom}
              location={locationModified}
              setLocation={updateLocation}
              setMapReady={setMap2Ready}
              draggableMarker={
                locationStatus !== ModerationStatus.Approved &&
                locationStatus !== ModerationStatus.Rejected &&
                taskStatus !== TaskStatus.Closed &&
                taskStatus !== TaskStatus.Cancelled
              }
            />
          </ModifyButton>
          <ActionButton
            id="mapaction"
            className={styles.gridActionButton}
            fieldName="location"
            moderationStatus={locationStatus}
            taskStatus={taskStatus}
            actionCallback={updateLocationStatus}
          />
        </div>
      </div>
    );
  }

  return <></>;
};

export default MapModeration;
