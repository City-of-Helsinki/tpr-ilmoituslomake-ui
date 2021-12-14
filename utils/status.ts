import { Dispatch } from "react";
import { ModerationStatusAction } from "../state/actions/moderationStatusTypes";
import {
  setPageStatus,
  setModerationAddressStatus,
  setModerationContactStatus,
  setModerationExtraKeywordsStatus,
  setModerationLinkStatus,
  setModerationLocationStatus,
  setModerationLongDescriptionStatus,
  setModerationMatkoTagStatus,
  setModerationNameStatus,
  setModerationPhotoAltTextStatus,
  setModerationPhotoStatus,
  setModerationShortDescriptionStatus,
  setModerationTagStatus,
} from "../state/actions/moderationStatus";
import { LANGUAGE_OPTIONS, ModerationStatus } from "../types/constants";
import { Photo } from "../types/general";

export const setModerationStatus = (photos: Photo[] | undefined, dispatch: Dispatch<ModerationStatusAction>): void => {
  if (!photos) {
    photos = [];
  }

  const newStatus = ModerationStatus.Edited;

  dispatch(setPageStatus(newStatus));

  dispatch(setModerationTagStatus(newStatus));
  dispatch(setModerationMatkoTagStatus(newStatus));
  dispatch(
    setModerationAddressStatus("fi", {
      street: newStatus,
      postal_code: newStatus,
      post_office: newStatus,
      neighborhood_id: newStatus,
      neighborhood: newStatus,
    })
  );
  dispatch(
    setModerationAddressStatus("sv", {
      street: newStatus,
      postal_code: newStatus,
      post_office: newStatus,
      neighborhood_id: newStatus,
      neighborhood: newStatus,
    })
  );
  dispatch(setModerationLocationStatus(newStatus));
  dispatch(setModerationContactStatus({ businessid: newStatus }));
  dispatch(setModerationContactStatus({ phone: newStatus }));
  dispatch(setModerationContactStatus({ email: newStatus }));

  LANGUAGE_OPTIONS.forEach((language) => {
    dispatch(setModerationNameStatus({ [language]: newStatus }));
    dispatch(setModerationShortDescriptionStatus({ [language]: newStatus }));
    dispatch(setModerationLongDescriptionStatus({ [language]: newStatus }));
    dispatch(setModerationExtraKeywordsStatus({ [language]: newStatus }));
    dispatch(setModerationLinkStatus({ [language]: newStatus }));
  });

  photos.forEach((photo, index) => {
    dispatch(setModerationPhotoStatus(index, { url: newStatus }));
    dispatch(setModerationPhotoStatus(index, { permission: newStatus }));
    dispatch(setModerationPhotoStatus(index, { source: newStatus }));

    LANGUAGE_OPTIONS.forEach((language) => {
      dispatch(setModerationPhotoAltTextStatus(index, { [language]: newStatus }));
    });
  });
};

export default setModerationStatus;
