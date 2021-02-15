export const defaultLocale = "fi";

const i18nLoader = async (locale: string, isModeration?: boolean): Promise<{ [locale: string]: { [key: string]: unknown } }> => {
  const { default: lngDict = {} } = await import(`../locales/${locale || defaultLocale}.json`);

  // Only return the sections needed in order to reduce page size
  if (isModeration) {
    return { [locale]: { common: lngDict.common, moderation: lngDict.moderation } };
  }
  return { [locale]: { common: lngDict.common, notification: lngDict.notification } };
};

export const i18nLoaderMultiple = async (locales?: string[], isModeration?: boolean): Promise<{ [locale: string]: { [key: string]: unknown } }> => {
  if (locales && locales.length > 0) {
    const promises = Promise.all(
      locales.map((locale) => {
        return i18nLoader(locale, isModeration);
      })
    );
    return (await promises).reduce((acc, item) => {
      return { ...acc, ...item };
    }, {});
  }
  return i18nLoader(defaultLocale, isModeration);
};

export default i18nLoaderMultiple;
