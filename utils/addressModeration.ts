import { Dispatch } from "react";
import { NextRouter } from "next/router";
import { ModerationAction } from "../state/actions/moderationTypes";
import { setModerationAddress, setModerationAddressFound, setModerationLocation } from "../state/actions/moderation";
// import getOrigin from "./request";
import { NEIGHBOURHOOD_URL, SEARCH_URL } from "../types/constants";

export const getModerationNeighborhood = async (
  router: NextRouter,
  lon: number,
  lat: number,
  dispatch: Dispatch<ModerationAction>
): Promise<void> => {
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
  language: string,
  dispatch: Dispatch<ModerationAction>
): Promise<void> => {
  // The Helsinki API does not use postal code
  // 16.9.2022 - The Helsinki API seems to have changed and municipality no longer works in the input field
  // const input = `${street.trim()} ${postOffice.trim()}`;
  // const language = router.locale === "sv" ? "sv" : "fi";

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
        municipality: resultMunicipality,
      } = geocodeResult.results[0];
      console.log("USING GEOCODE RESULT", geocodeResult.results[0]);

      // Set the location in redux state using the geocoded position
      // Note: this will cause the map to pan to centre on these coordinates
      // The geocoder returns the coordinates as lon,lat but Leaflet needs them as lat,lon
      dispatch(setModerationLocation([resultLocation.coordinates[1], resultLocation.coordinates[0]]));

      // Store the address found for display later if needed
      dispatch(
        setModerationAddressFound({
          street: `${resultStreet.name[language] ?? ""} ${resultNumber ?? ""}${resultLetter ?? ""}`,
          postalCode: "",
          postOffice: resultMunicipality.name[language] ?? "",
        })
      );
    } else {
      dispatch(setModerationLocation([0, 0]));
      dispatch(setModerationAddressFound(undefined));
    }
  }
};

export const searchModerationAddress = (
  router: NextRouter,
  street: string,
  postOffice: string,
  language: string,
  dispatch: Dispatch<ModerationAction>
): void => {
  if (street.length > 0 && postOffice.length > 0) {
    // The Helsinki API does not use postal code
    geocodeModerationAddress(router, street, postOffice, language, dispatch);
  }
};

export const geocodeModerationAltAddress = async (
  router: NextRouter,
  street: string,
  postalCode: string,
  postOffice: string,
  language: string,
  dispatch: Dispatch<ModerationAction>
): Promise<void> => {
  const altLanguage = language === "fi" ? "sv" : "fi";

  // The Helsinki API does not use postal code
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
        municipality: resultMunicipality,
      } = geocodeResult.results[0];
      console.log("USING GEOCODE RESULT", geocodeResult.results[0]);

      // Set the alternative language address
      dispatch(
        setModerationAddress(altLanguage, {
          street: `${resultStreet.name[altLanguage] ?? ""} ${resultNumber ?? ""}${resultLetter ?? ""}`,
          postal_code: postalCode,
          post_office: resultMunicipality.name[altLanguage] ?? "",
        })
      );

      // Also fetch the neighbourhood for the coordinates
      getModerationNeighborhood(router, resultLocation.coordinates[0], resultLocation.coordinates[1], dispatch);

      // Store the address found for display later if needed
      dispatch(
        setModerationAddressFound({
          street: `${resultStreet.name[language] ?? ""} ${resultNumber ?? ""}${resultLetter ?? ""}`,
          postalCode: "",
          postOffice: resultStreet.municipality ?? "",
        })
      );
    } else {
      dispatch(setModerationAddress("fi", { neighborhood_id: "", neighborhood: "" }));
      dispatch(setModerationAddress("sv", { neighborhood_id: "", neighborhood: "" }));
      dispatch(
        setModerationAddress(altLanguage, {
          street: "",
          postal_code: "",
          post_office: "",
        })
      );
      dispatch(setModerationAddressFound(undefined));
    }
  }
};

export const searchModerationAltAddress = (
  router: NextRouter,
  street: string,
  postalCode: string,
  postOffice: string,
  language: string,
  dispatch: Dispatch<ModerationAction>
): void => {
  if (street.length > 0 && postOffice.length > 0) {
    geocodeModerationAltAddress(router, street, postalCode, postOffice, language, dispatch);
  }
};
