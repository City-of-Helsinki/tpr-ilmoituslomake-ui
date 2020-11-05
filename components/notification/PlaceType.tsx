import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { RadioButton } from "hds-react";
import { RootState } from "../../state/reducers";

const PlaceType = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.placeType.title")}</h2>
      <div role="group" aria-labelledby="myPlace">
        <div id="myPlace">
          {i18n.t("notification.placeType.myPlace")}
          <span aria-hidden="true" className="hds-text-input__required">
            *
          </span>
        </div>
        <RadioButton id="placeType_private" value="private" label={i18n.t("notification.placeType.private")} />
        <RadioButton id="placeType_municipal" value="municipal" label={i18n.t("notification.placeType.municipal")} />
        <RadioButton id="placeType_institution" value="institution" label={i18n.t("notification.placeType.institution")} />
      </div>
    </div>
  );
};

export default PlaceType;
