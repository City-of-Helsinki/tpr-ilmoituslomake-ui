import React, { Dispatch, ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationLocation } from "../../state/actions/moderation";
import { setModerationLocationStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, TaskStatus, TaskType, MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";
import styles from "./MapModeration.module.scss";

const MapWrapper = dynamic(() => import("../common/MapWrapper"), { ssr: false });

interface MapModerationProps {
  setMapsReady?: (ready: boolean) => void;
}

const MapModeration = ({ setMapsReady }: MapModerationProps): ReactElement => {
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
  const initialZoom = MAP_INITIAL_ZOOM;

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

  // The maps only initialise properly when not hidden, so use flags to only hide the maps after they are ready
  const [map1Ready, setMap1Ready] = useState<boolean>(false);
  const [map2Ready, setMap2Ready] = useState<boolean>(false);
  const [initialLocationStatus, setInitialLocationStatus] = useState<ModerationStatus | undefined>(ModerationStatus.Edited);

  useEffect(() => {
    if (taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) {
      // Both maps are needed
      if (setMapsReady) {
        setMapsReady(map1Ready && map2Ready);
      }
      if (map2Ready) {
        // Enable the location to be edited by default
        setInitialLocationStatus(undefined);
        updateLocationStatus("", ModerationStatus.Edited);
      }
    } else if (setMapsReady) {
      // Only one map is needed
      setMapsReady(map1Ready);
    }
  }, [taskType, map1Ready, map2Ready, setMapsReady, setInitialLocationStatus, updateLocationStatus]);

  if (taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.RemoveTip || taskType === TaskType.PlaceInfo) {
    return (
      <div className="formSection">
        <div className="gridLayoutContainer moderation">
          {locationStatus !== ModerationStatus.Edited && (
            <h4 className="gridColumn1 moderation">{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.selected")}`}</h4>
          )}
          {locationStatus === ModerationStatus.Edited && (
            <h4 className="gridColumn1 moderation">{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.modified")}`}</h4>
          )}

          <MapWrapper
            className={`gridColumn1 ${styles.map}`}
            initialCenter={initialCenter as [number, number]}
            initialZoom={initialZoom}
            location={locationStatus !== ModerationStatus.Edited ? locationSelected : locationModified}
            setLocation={locationStatus === ModerationStatus.Edited ? updateLocation : undefined}
            setMapReady={setMap1Ready}
            draggableMarker={locationStatus === ModerationStatus.Edited && taskStatus !== TaskStatus.Closed}
          />
        </div>
      </div>
    );
  }

  if (taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) {
    return (
      <div className="formSection">
        <div className="gridLayoutContainer moderation">
          <h4 className="gridColumn1 moderation">{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.selected")}`}</h4>
          <h4 className="gridColumn2 moderation">{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.modified")}`}</h4>

          <MapWrapper
            className={`gridColumn1 ${styles.map}`}
            initialCenter={initialCenter as [number, number]}
            initialZoom={initialZoom}
            location={locationSelected}
            setMapReady={setMap1Ready}
            draggableMarker={false}
          />

          <ModifyButton
            className="gridColumn2"
            label={i18n.t("moderation.map.title")}
            fieldName="location"
            moderationStatus={initialLocationStatus || locationStatus}
            taskStatus={taskStatus}
            modifyCallback={updateLocationStatus}
          >
            <MapWrapper
              className={`gridColumn2 ${styles.map}`}
              initialCenter={initialCenter as [number, number]}
              initialZoom={initialZoom}
              location={locationModified}
              setLocation={updateLocation}
              setMapReady={setMap2Ready}
              draggableMarker={
                locationStatus !== ModerationStatus.Approved && locationStatus !== ModerationStatus.Rejected && taskStatus !== TaskStatus.Closed
              }
            />
          </ModifyButton>
          <ActionButton
            className="gridColumn3"
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

MapModeration.defaultProps = {
  setMapsReady: undefined,
};

export default MapModeration;
