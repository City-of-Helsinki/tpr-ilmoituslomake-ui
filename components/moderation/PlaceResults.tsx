import React, { ReactElement } from "react";
import { useI18n } from "next-localization";

const PlaceResults = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h2 className="moderation">{`${i18n.t("moderation.placeResults.found")} ??? ${i18n.t("moderation.placeResults.places")}`}</h2>
      <div>LIST HERE</div>
    </div>
  );
};

export default PlaceResults;
