import { LANGUAGE_OPTIONS } from "../types/constants";
import { OptionType } from "../types/general";

export const getDisplayName = (locale: string, name: { [key: string]: unknown }, userPlaceName?: string, defaultName?: string): string => {
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
  return defaultName ?? "";
};

export const sortByOptionLabel = (a: OptionType, b: OptionType): number => {
  const labelA = a.label.toLowerCase();
  const labelB = b.label.toLowerCase();
  if (labelA < labelB) {
    return -1;
  }
  if (labelA > labelB) {
    return 1;
  }
  return 0;
};
