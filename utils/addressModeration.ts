import { Dispatch } from "react";
import { NextRouter } from "next/router";
import { ModerationAction } from "../state/actions/types";
import { setModerationAddress, setModerationLocation } from "../state/actions/moderation";
import getOrigin from "./request";
import { NEIGHBOURHOOD_URL, SEARCH_URL } from "../types/constants";

export const getModerationNeighborhood = async (
  router: NextRouter,
  lon: number,
  lat: number,
  dispatch: Dispatch<ModerationAction>
): Promise<void> => {
  // Fetch the neighbourhood for these coordinates
  const neighbourhoodResponse = await fetch(`${getOrigin(router)}${NEIGHBOURHOOD_URL}&lon=${lon}&lat=${lat}`);
  if (neighbourhoodResponse.ok) {
    const neighbourhoodResult = await neighbourhoodResponse.json();

    console.log("NEIGHBOURHOOD RESPONSE", neighbourhoodResult);

    if (neighbourhoodResult.results && neighbourhoodResult.results.length > 0) {
      // Use the first result
      const { origin_id: neighborhoodId = "", name: { fi: resultNameFi = "", sv: resultNameSv = "" } = {} } = neighbourhoodResult.results[0];
      console.log("USING NEIGHBOURHOOD RESULT", neighbourhoodResult.results[0]);

      dispatch(setModerationAddress("fi", { neighborhood_id: neighborhoodId, neighborhood: resultNameFi }));
      dispatch(setModerationAddress("sv", { neighborhood_id: neighborhoodId, neighborhood: resultNameSv }));
    } else {
      dispatch(setModerationAddress("fi", { neighborhood_id: "", neighborhood: "" }));
      dispatch(setModerationAddress("sv", { neighborhood_id: "", neighborhood: "" }));
    }
  }
};

export const geocodeModerationAddress = async (
  router: NextRouter,
  street: string,
  postOffice: string,
  dispatch: Dispatch<ModerationAction>
): Promise<void> => {
  // The Helsinki API does not use postal code
  const input = `${street.trim()} ${postOffice.trim()}`;
  const language = router.locale === "sv" ? "sv" : "fi";

  const geocodeResponse = await fetch(`${getOrigin(router)}${SEARCH_URL}&type=address&input=${input.trim()}&language=${language}`);
  if (geocodeResponse.ok) {
    const geocodeResult = await geocodeResponse.json();

    console.log("GEOCODE RESPONSE", geocodeResult);

    if (geocodeResult.results && geocodeResult.results.length > 0) {
      // Use the first result
      const { location: resultLocation } = geocodeResult.results[0];
      console.log("USING GEOCODE RESULT", geocodeResult.results[0]);

      // Set the location in redux state using the geocoded position
      // Note: this will cause the map to pan to centre on these coordinates
      // The geocoder returns the coordinates as lon,lat but Leaflet needs them as lat,lon
      dispatch(setModerationLocation([resultLocation.coordinates[1], resultLocation.coordinates[0]]));

      // Also fetch the neighbourhood for these coordinates
      getModerationNeighborhood(router, resultLocation.coordinates[0], resultLocation.coordinates[1], dispatch);
    } else {
      dispatch(setModerationLocation([0, 0]));
      dispatch(setModerationAddress("fi", { neighborhood_id: "", neighborhood: "" }));
      dispatch(setModerationAddress("sv", { neighborhood_id: "", neighborhood: "" }));
    }
  }
};

export const searchModerationAddress = (router: NextRouter, street: string, postOffice: string, dispatch: Dispatch<ModerationAction>): void => {
  if (street.length > 0 && postOffice.length > 0) {
    // The Helsinki API does not use postal code
    geocodeModerationAddress(router, street, postOffice, dispatch);
  }
};
