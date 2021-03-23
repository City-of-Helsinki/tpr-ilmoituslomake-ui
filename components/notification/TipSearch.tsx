import React, { Dispatch, ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Select, TextInput } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationTip } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { ItemType, MAX_LENGTH } from "../../types/constants";
import { NotificationPlaceResult, OptionType } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import getOrigin from "../../utils/request";
import { isTipFieldValid } from "../../utils/validation";

const TipSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const emptyOption = { id: 0, label: "" };

  const [placeResults, setPlaceResults] = useState<OptionType[]>([emptyOption]);
  const [selectedPlace, setSelectedPlace] = useState<OptionType>(emptyOption);

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { target, item_type, user_place_name } = tip;

  const tipValidation = useSelector((state: RootState) => state.notificationValidation.tipValidation);
  const { target: targetValid, user_place_name: userPlaceNameValid } = tipValidation;

  const selectPlace = (selected: OptionType) => {
    console.log("selectPlace", selected);

    setSelectedPlace(selected);
    dispatch(setNotificationTip({ ...tip, target: selected.id as number }));
  };

  const updateDetails = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationTip({ ...tip, [evt.target.name]: evt.target.value }));
  };

  const validatePlace = () => {
    isTipFieldValid("target", tip, dispatchValidation);
  };

  const validateDetails = (evt: ChangeEvent<HTMLInputElement>) => {
    isTipFieldValid(evt.target.name, tip, dispatchValidation);
  };

  const searchPlaces = async (evt: ChangeEvent<HTMLInputElement>) => {
    const placeName = evt.target.value;

    setPlaceResults([emptyOption]);
    selectPlace(emptyOption);

    if (placeName.trim().length > 0) {
      const placeResponse = await fetch(`${getOrigin(router)}/api/notification/list/?search=${placeName.trim()}`);
      if (placeResponse.ok) {
        const placeResult = await (placeResponse.json() as Promise<{ results: NotificationPlaceResult[] }>);

        console.log("PLACE RESPONSE", placeResult);

        if (placeResult && placeResult.results && placeResult.results.length > 0) {
          setPlaceResults(
            placeResult.results
              .sort((a: NotificationPlaceResult, b: NotificationPlaceResult) => {
                const nameA = getDisplayName(router.locale || defaultLocale, a.data.name);
                const nameB = getDisplayName(router.locale || defaultLocale, b.data.name);
                return nameA.localeCompare(nameB);
              })
              .map((result) => ({ id: result.id, label: getDisplayName(router.locale || defaultLocale, result.data.name) }))
          );
        }
      }
    }
  };

  const preselectPlaceOnMount = async () => {
    if (target > 0) {
      const placeResponse = await fetch(`${getOrigin(router)}/api/notification/get/${target}`);
      if (placeResponse.ok) {
        const placeResult = await (placeResponse.json() as Promise<{ id: number; data: NotificationSchema }>);

        console.log("PLACE RESPONSE", placeResult);

        if (placeResult && placeResult.data) {
          const selected = { id: placeResult.id, label: getDisplayName(router.locale || defaultLocale, placeResult.data.name) };
          setPlaceResults([selected]);
          setSelectedPlace(selected);
        }
      }
    }
  };

  // If specified, search for the specified place on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(preselectPlaceOnMount);

  return (
    <div className="formSection">
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
        <>
          <TextInput
            id="placeName"
            className="formInput"
            name="placeName"
            maxLength={MAX_LENGTH}
            onChange={searchPlaces}
            label={i18n.t("notification.tip.placeName.label")}
            helperText={i18n.t("notification.tip.placeName.helperText")}
          />

          <Select
            id="placeResults"
            className="formInput"
            options={placeResults}
            value={selectedPlace}
            onChange={selectPlace}
            onBlur={validatePlace}
            label={i18n.t("notification.tip.placeResults.label")}
            selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
            clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
            invalid={!targetValid.valid}
            error={
              !targetValid.valid ? i18n.t(targetValid.message as string).replace("$fieldName", i18n.t("notification.tip.placeResults.label")) : ""
            }
            required
            aria-required
          />
        </>
      )}
    </div>
  );
};

export default TipSearch;
