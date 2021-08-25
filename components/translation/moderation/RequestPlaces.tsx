import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconAlertCircleFill, IconCrossCircleFill, IconInfoCircle } from "hds-react";
import { setModerationTranslationRequest } from "../../../state/actions/moderationTranslation";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { RootState } from "../../../state/reducers";
import { TaskStatus } from "../../../types/constants";
import { ModerationTranslationRequest } from "../../../types/general";
import { getDisplayName } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";
import styles from "./RequestPlaces.module.scss";

const RequestPlaces = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { selectedPlaces, taskStatus } = requestDetail;

  const requestValidation = useSelector((state: RootState) => state.moderationTranslation.requestValidation);
  const { selectedPlaces: selectedPlacesValid } = requestValidation;

  const removePlaceFromSelection = (placeId: number) => {
    const newSelectedPlaces = selectedPlaces.reduce((acc: ModerationTranslationRequest["selectedPlaces"], place) => {
      return place.id === placeId ? acc : [...acc, place];
    }, []);
    dispatch(setModerationTranslationRequest({ ...requestDetail, selectedPlaces: newSelectedPlaces }));
  };

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.places")}</h2>

      <div className={styles.placeContainer}>
        <h3 className="moderation">{`${i18n.t("moderation.translation.request.placesToTranslate")} *`}</h3>

        {selectedPlaces.map((place) => {
          const { id: placeId, name } = place;
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

        {selectedPlaces.length === 0 && (
          <div className={`${styles.selectPlacesMessage} ${!selectedPlacesValid.valid ? styles.error : ""}`}>
            {!selectedPlacesValid.valid && <IconAlertCircleFill className={styles.icon} aria-hidden />}
            {selectedPlacesValid.valid && <IconInfoCircle className={styles.icon} aria-hidden />}
            {i18n.t("moderation.translation.request.selectPlaces")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPlaces;
