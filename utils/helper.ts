import { LANGUAGE_OPTIONS } from "../types/constants";

export const getDisplayName = (locale: string, name: { [key: string]: unknown }): string => {
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
  return "";
};

export default getDisplayName;
