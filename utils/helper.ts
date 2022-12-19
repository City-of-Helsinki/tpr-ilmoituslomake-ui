import { NextRouter } from "next/router";
import { I18n } from "next-localization";
import { defaultLocale } from "./i18n";
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

export const parseOpeningTimesText = (openingTimesText: string, i18n: I18n<unknown>, router: NextRouter): string[] => {
  // The opening times text is one string containing all the data in a certain format
  // Use the rules defined in the 'Kaupunkialustan yhdistäminen Haukeen' document to parse and format the data as required
  // NOTE: whitespace such as leading and trailing spaces are important here
  const rules = [
    { searchValue: "\n\n========================================\n", replaceValue: "////" },
    { searchValue: "\n========================================\n", replaceValue: "////" },
    { searchValue: "\n\n", replaceValue: "//" },
    { searchValue: "\n", replaceValue: "//" },
    { searchValue: `//${i18n.t("common.openingTimes.openingHours")}:`, replaceValue: "" },
    { searchValue: `// ${i18n.t("common.openingTimes.closed")}`, replaceValue: ` - ${i18n.t("common.openingTimes.closed")}` },
    { searchValue: `// ${i18n.t("common.openingTimes.everyDay")} `, replaceValue: " - " },
    { searchValue: "// ", replaceValue: "\n- " },
    { searchValue: "////", replaceValue: "\n" },
    { searchValue: `//${i18n.t("common.openingTimes.datePeriod")}: ${i18n.t("common.openingTimes.notSpecified")}`, replaceValue: ":" },
    {
      searchValue: `${i18n.t("common.openingTimes.datePeriod")}: ${i18n.t("common.openingTimes.notSpecified")}`,
      replaceValue: `${i18n.t("common.openingTimes.validForNow")}`,
    },
    { searchValue: `//${i18n.t("common.openingTimes.datePeriod")}:`, replaceValue: ":" },
    { searchValue: `${i18n.t("common.openingTimes.everyDay")} `, replaceValue: "" },
    { searchValue: ` ${i18n.t("common.openingTimes.wholeDay")} `, replaceValue: " " },
    ...Array(7)
      .fill(undefined)
      .map((array, day) => {
        return {
          searchValue: i18n.t(`common.openingTimes.weekDayLong.${day + 1}`),
          replaceValue: i18n.t(`common.openingTimes.weekDayShort.${day + 1}`),
        };
      }),
    ...Array(12)
      .fill(undefined)
      .map((array, month) => {
        return {
          searchValue: `${(router.locale || defaultLocale) === "fi" ? "." : ""} ${i18n.t(`common.openingTimes.month.${month + 1}`)} 20`,
          replaceValue: `.${month + 1}.20`,
        };
      }),
  ];

  if ((router.locale || defaultLocale) === "en") {
    rules.push({ searchValue: "a.m.", replaceValue: "am" });
    rules.push({ searchValue: "p.m.", replaceValue: "pm" });
  }

  const parsedOpeningTimesText = rules.reduce((text, rule) => {
    const { searchValue, replaceValue } = rule;
    return text.replaceAll(searchValue, replaceValue);
  }, openingTimesText);

  return parsedOpeningTimesText.split("\n").filter((text) => text);
};
