import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconAlertCircleFill, IconCrossCircleFill, IconInfoCircle } from "hds-react";
import { setModerationTranslationRequest } from "../../../state/actions/moderationTranslation";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { RootState } from "../../../state/reducers";
import { TaskStatus } from "../../../types/constants";
import { ModerationTranslationRequestResultTask } from "../../../types/general";
import { getDisplayName } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";
import { isModerationTranslationRequestFieldValid } from "../../../utils/moderationValidation";
import styles from "./RequestPlaces.module.scss";

const RequestPlaces = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { tasks: requestTasks } = requestDetail;

  const requestValidation = useSelector((state: RootState) => state.moderationTranslation.requestValidation);
  const { tasks: requestTasksValid } = requestValidation;

  const removePlaceFromSelection = (targetId: number) => {
    const newRequestTasks = requestTasks.reduce((acc: ModerationTranslationRequestResultTask[], task) => {
      const { target } = task;
      return target.id === targetId ? acc : [...acc, task];
    }, []);
    dispatch(setModerationTranslationRequest({ ...requestDetail, tasks: newRequestTasks }));
    isModerationTranslationRequestFieldValid("tasks", "tasks", requestDetail, dispatch);
  };

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.places")}</h2>

      <div className={styles.placeContainer}>
        <h3 className="moderation">{`${i18n.t("moderation.translation.request.placesToTranslate")} *`}</h3>

        {requestTasks.map((task) => {
          const { target, taskStatus } = task;
          const { id: placeId, name } = target;
          const key = `requestplace_${placeId}`;

          return (
            <div key={key} className={styles.placeItem}>
              <span className={styles.placeName}>{getDisplayName(router.locale || defaultLocale, name)}</span>
              <Button
                variant="secondary"
                size="small"
                aria-label={i18n.t("moderation.button.collapse")}
                onClick={() => removePlaceFromSelection(placeId)}
                disabled={taskStatus === TaskStatus.Closed}
              >
                <IconCrossCircleFill aria-hidden />
              </Button>
            </div>
          );
        })}

        {requestTasks.length === 0 && (
          <div className={`${styles.selectPlacesMessage} ${!requestTasksValid.valid ? styles.error : ""}`}>
            {!requestTasksValid.valid && <IconAlertCircleFill className={styles.icon} aria-hidden />}
            {requestTasksValid.valid && <IconInfoCircle className={styles.icon} aria-hidden />}
            {i18n.t("moderation.translation.request.selectPlaces")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPlaces;
