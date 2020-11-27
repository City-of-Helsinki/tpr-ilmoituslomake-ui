import React, { ReactElement } from "react";
import { useI18n } from "next-localization";

const PlaceResults = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h3>{`${i18n.t("moderation.placeResults.found")} ??? ${i18n.t("moderation.placeResults.places")}`}</h3>
      <div>LIST HERE</div>
    </div>
  );
};

export default PlaceResults;
