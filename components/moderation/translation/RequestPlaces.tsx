import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconCrossCircleFill } from "hds-react";
import { RootState } from "../../../state/reducers";
import { getDisplayName } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";
import styles from "./RequestPlaces.module.scss";

const RequestPlaces = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { selectedPlaces } = requestDetail;

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.places")}</h2>

      {selectedPlaces.length > 0 && (
        <div className={styles.placeContainer}>
          <h3 className="moderation">{i18n.t("moderation.translation.request.placesToTranslate")}</h3>

          {selectedPlaces.map((place) => {
            const { id: placeId, name } = place;
            const key = `requestplace_${placeId}`;

            return (
              <div key={key} className={styles.placeItem}>
                <span className={styles.placeName}>{getDisplayName(router.locale || defaultLocale, name)}</span>
                <Button variant="secondary" size="small" aria-label={i18n.t("moderation.button.collapse")} onClick={() => {}}>
                  <IconCrossCircleFill aria-hidden />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestPlaces;
