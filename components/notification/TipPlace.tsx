import React, { Dispatch, ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationTip } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { ItemType, MAX_LENGTH } from "../../types/constants";
import { NotificationSchema } from "../../types/notification_schema";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import getOrigin from "../../utils/request";
import { isTipFieldValid } from "../../utils/validation";
import TipNotice from "./TipNotice";
import styles from "./TipPlace.module.scss";

const TipPlace = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const [selectedPlace, setSelectedPlace] = useState<string>("");

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { target, item_type, user_place_name } = tip;

  const tipValidation = useSelector((state: RootState) => state.notificationValidation.tipValidation);
  const { user_place_name: userPlaceNameValid } = tipValidation;

  const updateDetails = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationTip({ ...tip, [evt.target.name]: evt.target.value }));
  };

  const validateDetails = (evt: ChangeEvent<HTMLInputElement>) => {
    isTipFieldValid(evt.target.name, tip, dispatchValidation);
  };

  const preselectPlaceOnMount = async () => {
    if (target > 0) {
      const placeResponse = await fetch(`${getOrigin(router)}/api/notification/get/${target}`);
      if (placeResponse.ok) {
        const placeResult = await (placeResponse.json() as Promise<{ id: number; data: NotificationSchema }>);

        console.log("PLACE RESPONSE", placeResult);

        if (placeResult && placeResult.data) {
          const selectedPlaceName = getDisplayName(router.locale || defaultLocale, placeResult.data.name);
          setSelectedPlace(selectedPlaceName);
        }
      }
    }
  };

  // If specified, search for the specified place on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(preselectPlaceOnMount);

  return (
    <div className="formItem">
      {item_type === ItemType.ChangeRequestAdd && (
        <TextInput
          id="userPlaceName"
          className="formInput"
          name="user_place_name"
          value={user_place_name}
          maxLength={MAX_LENGTH}
          onChange={updateDetails}
          onBlur={validateDetails}
          label={i18n.t("notification.tip.addPlaceName.label")}
          invalid={!userPlaceNameValid.valid}
          errorText={
            !userPlaceNameValid.valid
              ? i18n.t(userPlaceNameValid.message as string).replace("$fieldName", i18n.t("notification.tip.addPlaceName.label"))
              : ""
          }
          required
          aria-required
        />
      )}

      {(item_type === ItemType.ChangeRequestChange || item_type === ItemType.ChangeRequestDelete) && (
        <div className={styles.placeNameNotice}>
          <div className={styles.placeName}>
            <TextInput
              id="placeName"
              className="formInput"
              name="placeName"
              value={selectedPlace}
              maxLength={MAX_LENGTH}
              label={i18n.t("notification.tip.placeResults.label")}
              disabled
            />
          </div>
          <div className={styles.notice}>{target > 0 && <TipNotice selectedPlaceName={selectedPlace} />}</div>
        </div>
      )}
    </div>
  );
};

export default TipPlace;
