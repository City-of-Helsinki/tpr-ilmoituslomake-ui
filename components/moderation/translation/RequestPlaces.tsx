import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { RootState } from "../../../state/reducers";
import { getDisplayName } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";

const RequestPlaces = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { selectedPlaces } = requestDetail;

  return (
    <div className="formSection">
      <h1 className="moderation">{i18n.t("moderation.translation.request.title")}</h1>

      <h2 className="moderation">{i18n.t("moderation.translation.request.places")}</h2>

      {selectedPlaces.length > 0 && (
        <div>
          {selectedPlaces.map((place) => {
            const { id: placeId, name } = place;
            const key = `requestplace_${placeId}`;

            return <div key={key}>{getDisplayName(router.locale || defaultLocale, name)}</div>;
          })}
        </div>
      )}
    </div>
  );
};

export default RequestPlaces;
