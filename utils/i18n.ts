export const defaultLocale = "fi";

const i18nLoader = async (
  locale: string,
  isModeration?: boolean,
  isTranslation?: boolean
): Promise<{ [locale: string]: { [key: string]: unknown } }> => {
  const { default: lngDict = {} } = await import(`../locales/${locale || defaultLocale}.json`);

  // Only return the sections needed in order to reduce page size
  if (isModeration) {
    return { [locale]: { common: lngDict.common, moderation: lngDict.moderation } };
  }
  if (isTranslation) {
    return { [locale]: { common: lngDict.common, translation: lngDict.translation } };
  }
  return { [locale]: { common: lngDict.common, notification: lngDict.notification } };
};

export const i18nLoaderMultiple = async (
  locales?: string[],
  isModeration?: boolean,
  isTranslation?: boolean
): Promise<{ [locale: string]: { [key: string]: unknown } }> => {
  if (locales && locales.length > 0) {
    const promises = Promise.all(
      locales.map((locale) => {
        return i18nLoader(locale, isModeration, isTranslation);
      })
    );
    return (await promises).reduce((acc, item) => {
      return { ...acc, ...item };
    }, {});
  }
  return i18nLoader(defaultLocale, isModeration, isTranslation);
};

export default i18nLoaderMultiple;
