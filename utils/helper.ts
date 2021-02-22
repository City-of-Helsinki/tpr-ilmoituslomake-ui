import { LANGUAGE_OPTIONS } from "../types/constants";

export const getDisplayName = (locale: string, name: { [key: string]: unknown }, userPlaceName?: string): string => {
  if (userPlaceName && userPlaceName.length > 0) {
    // For a tip about a new place, only the user-defined place name is available
    return userPlaceName;
  }
  if (name) {
    // Preferably return the name for the currently selected language, or if not available, then the name from the first available language
    if (name[locale] && (name[locale] as string).length > 0) {
      return name[locale] as string;
    }
    for (let i = 0; i < LANGUAGE_OPTIONS.length; i += 1) {
      const language = LANGUAGE_OPTIONS[i];
      if (name[language] && (name[language] as string).length > 0) {
        return name[language] as string;
      }
    }
  }
  return "";
};

export default getDisplayName;
