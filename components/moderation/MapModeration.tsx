import React, { Dispatch, ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationLocation } from "../../state/actions/moderation";
import { setModerationLocationStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "../../types/constants";
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

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { location: locationStatus } = moderationStatus;

  const initialCenter = MAP_INITIAL_CENTER;
  const initialZoom = MAP_INITIAL_ZOOM;

  const updateLocation = (coordinates: [number, number]) => {
    dispatch(setModerationLocation(coordinates));
  };

  const updateLocationStatus = (fieldName: string, status: ModerationStatus) => {
    dispatchStatus(setModerationLocationStatus(status));
  };

  // The maps only initialise properly when not hidden, so use flags to only hide the maps after they are ready
  const [map1Ready, setMap1Ready] = useState<boolean>(false);
  const [map2Ready, setMap2Ready] = useState<boolean>(false);
  const [initialLocationStatus, setInitialLocationStatus] = useState<ModerationStatus | undefined>(ModerationStatus.Edited);

  useEffect(() => {
    if (setMapsReady) {
      setMapsReady(map1Ready && map2Ready);
    }
    if (map2Ready) {
      setInitialLocationStatus(undefined);
    }
  }, [map1Ready, map2Ready, setMapsReady, setInitialLocationStatus]);

  return (
    <div className="formSection">
      <div className="gridLayoutContainer moderation">
        <h4 className="gridColumn1">{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2">{`${i18n.t("moderation.map.title")}${i18n.t("moderation.task.modified")}`}</h4>

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
          status={initialLocationStatus || locationStatus}
          modifyCallback={updateLocationStatus}
        >
          <MapWrapper
            className={`gridColumn2 ${styles.map}`}
            initialCenter={initialCenter as [number, number]}
            initialZoom={initialZoom}
            location={locationModified}
            setLocation={updateLocation}
            setMapReady={setMap2Ready}
            draggableMarker={locationStatus !== ModerationStatus.Approved && locationStatus !== ModerationStatus.Rejected}
          />
        </ModifyButton>
        <ActionButton className="gridColumn3" fieldName="location" status={locationStatus} actionCallback={updateLocationStatus} />
      </div>
    </div>
  );
};

MapModeration.defaultProps = {
  setMapsReady: undefined,
};

export default MapModeration;
