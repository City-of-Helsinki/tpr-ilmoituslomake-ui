import { Dispatch } from "react";
import { NextRouter } from "next/router";
import { NotificationAction } from "../state/actions/notificationTypes";
import {
  setNotificationAddress,
  setNotificationAddressFound,
  setNotificationLocation,
  setNotificationOriginalLocation,
} from "../state/actions/notification";
// import getOrigin from "./request";
import { NEIGHBOURHOOD_URL, SEARCH_URL } from "../types/constants";

export const getNeighborhood = async (router: NextRouter, lon: number, lat: number, dispatch: Dispatch<NotificationAction>): Promise<void> => {
  // Fetch the neighbourhood for these coordinates
  // const neighbourhoodResponse = await fetch(`${getOrigin(router)}${NEIGHBOURHOOD_URL}&lon=${lon}&lat=${lat}`);
  const neighbourhoodResponse = await fetch(`${NEIGHBOURHOOD_URL}&lon=${lon}&lat=${lat}`);
  if (neighbourhoodResponse.ok) {
    const neighbourhoodResult = await neighbourhoodResponse.json();

    console.log("NEIGHBOURHOOD RESPONSE", neighbourhoodResult);

    if (neighbourhoodResult.results && neighbourhoodResult.results.length > 0) {
      // Use the first result
      const { origin_id: neighborhoodId = "", name: { fi: resultNameFi = "", sv: resultNameSv = "" } = {} } = neighbourhoodResult.results[0];
      console.log("USING NEIGHBOURHOOD RESULT", neighbourhoodResult.results[0]);

      dispatch(setNotificationAddress("fi", { neighborhood_id: neighborhoodId, neighborhood: resultNameFi }));
      dispatch(setNotificationAddress("sv", { neighborhood_id: neighborhoodId, neighborhood: resultNameSv }));
    } else {
      dispatch(setNotificationAddress("fi", { neighborhood_id: "", neighborhood: "" }));
      dispatch(setNotificationAddress("sv", { neighborhood_id: "", neighborhood: "" }));
    }
  }
};

export const geocodeAddress = async (
  router: NextRouter,
  street: string,
  postOffice: string,
  dispatch: Dispatch<NotificationAction>
): Promise<void> => {
  // The Helsinki API does not use postal code
  // 16.9.2022 - The Helsinki API seems to have changed and municipality no longer works in the input field
  // const input = `${street.trim()} ${postOffice.trim()}`;
  const language = router.locale === "sv" ? "sv" : "fi";

  // const geocodeResponse = await fetch(`${getOrigin(router)}${SEARCH_URL}&type=address&input=${input.trim()}&language=${language}`);
  // const geocodeResponse = await fetch(
  //   `${getOrigin(router)}${SEARCH_URL}&type=address&input=${street.trim()}&municipality=${postOffice.trim()}&language=${language}`
  // );
  const geocodeResponse = await fetch(`${SEARCH_URL}&type=address&input=${street.trim()}&municipality=${postOffice.trim()}&language=${language}`);
  if (geocodeResponse.ok) {
    const geocodeResult = await geocodeResponse.json();

    console.log("GEOCODE RESPONSE", geocodeResult);

    if (geocodeResult.results && geocodeResult.results.length > 0) {
      // Use the first result
      const {
        location: resultLocation,
        street: resultStreet,
        number: resultNumber,
        letter: resultLetter,
        postal_code: resultPostalCode,
      } = geocodeResult.results[0];
      console.log("USING GEOCODE RESULT", geocodeResult.results[0]);

      // Set the location in redux state using the geocoded position
      // Note: this will cause the map to pan to centre on these coordinates
      // The geocoder returns the coordinates as lon,lat but Leaflet needs them as lat,lon
      dispatch(setNotificationLocation([resultLocation.coordinates[1], resultLocation.coordinates[0]]));

      // Also set the location in another variable for comparison if the map marker is later moved
      dispatch(setNotificationOriginalLocation([resultLocation.coordinates[1], resultLocation.coordinates[0]]));

      // Also fetch the neighbourhood for these coordinates
      getNeighborhood(router, resultLocation.coordinates[0], resultLocation.coordinates[1], dispatch);

      // Store the address found for display later if needed
      dispatch(
        setNotificationAddressFound({
          street: `${resultStreet.name[language] ?? ""} ${resultNumber ?? ""}${resultLetter ?? ""}`,
          postalCode: resultPostalCode ?? "",
          postOffice: resultStreet.municipality ?? "",
        })
      );
    } else {
      dispatch(setNotificationLocation([0, 0]));
      dispatch(setNotificationOriginalLocation([0, 0]));
      dispatch(setNotificationAddress("fi", { neighborhood_id: "", neighborhood: "" }));
      dispatch(setNotificationAddress("sv", { neighborhood_id: "", neighborhood: "" }));
      dispatch(setNotificationAddressFound(undefined));
    }
  }
};

export const searchAddress = (
  router: NextRouter,
  streetFi: string,
  postOfficeFi: string,
  streetSv: string,
  postOfficeSv: string,
  dispatch: Dispatch<NotificationAction>
): void => {
  // The Helsinki API does not use postal code
  const street = router.locale === "sv" ? streetSv : streetFi;
  const postOffice = router.locale === "sv" ? postOfficeSv : postOfficeFi;
  geocodeAddress(router, street, postOffice, dispatch);
};
