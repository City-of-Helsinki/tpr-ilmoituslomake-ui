import { Dispatch } from "react";
import { NotificationAction } from "../state/actions/types";
import { setNotificationAddress, setNotificationLocation } from "../state/actions/notification";
import { NEIGHBOURHOOD_URL, SEARCH_URL } from "../types/constants";

export const getNeighborhood = async (lon: number, lat: number, dispatch: Dispatch<NotificationAction>): Promise<void> => {
  // Fetch the neighbourhood for these coordinates
  const neighbourhoodResponse = await fetch(`${NEIGHBOURHOOD_URL}&lon=${lon}&lat=${lat}`);
  if (neighbourhoodResponse.ok) {
    const neighbourhoodResult = await neighbourhoodResponse.json();

    console.log("NEIGHBOURHOOD RESPONSE", neighbourhoodResult);

    if (neighbourhoodResult.results && neighbourhoodResult.results.length > 0) {
      // Use the first result
      const { name: { fi: resultNameFi = "", sv: resultNameSv = "" } = {} } = neighbourhoodResult.results[0];
      console.log(resultNameFi, resultNameSv);

      dispatch(setNotificationAddress("fi", { neighborhood: resultNameFi }));
      dispatch(setNotificationAddress("sv", { neighborhood: resultNameSv }));
    }
  }
};

export const geocodeAddress = async (
  locale: string | undefined,
  street: string,
  postOffice: string,
  dispatch: Dispatch<NotificationAction>
): Promise<void> => {
  // The Helsinki API does not use postal code
  const input = `${street} ${postOffice}`;
  const language = locale === "sv" ? "sv" : "fi";

  const geocodeResponse = await fetch(`${SEARCH_URL}&type=address&input=${input}&language=${language}`);
  if (geocodeResponse.ok) {
    const geocodeResult = await geocodeResponse.json();

    console.log("GEOCODE RESPONSE", geocodeResult);

    if (geocodeResult.results && geocodeResult.results.length > 0) {
      // Use the first result
      const { location: resultLocation } = geocodeResult.results[0];
      console.log(resultLocation.coordinates);

      // Set the location in redux state using the geocoded position
      // Note: this will cause the map to pan to centre on these coordinates
      // The geocoder returns the coordinates as lon,lat but Leaflet needs them as lat,lon
      dispatch(setNotificationLocation([resultLocation.coordinates[1], resultLocation.coordinates[0]]));

      // Also fetch the neighbourhood for these coordinates
      getNeighborhood(resultLocation.coordinates[0], resultLocation.coordinates[1], dispatch);
    }
  }
};
