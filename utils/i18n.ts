export const defaultLocale = "fi";

const i18nLoader = async (locale: string): Promise<{ [locale: string]: { [key: string]: unknown } }> => {
  const { default: lngDict = {} } = await import(`../locales/${locale || defaultLocale}.json`);
  return { [locale]: lngDict };
};

export const i18nLoaderMultiple = async (locales?: string[]): Promise<{ [locale: string]: { [key: string]: unknown } }> => {
  if (locales && locales.length > 0) {
    const promises = Promise.all(
      locales.map((locale) => {
        return i18nLoader(locale);
      })
    );
    return (await promises).reduce((acc, item) => {
      return { ...acc, ...item };
    }, {});
  }
  return i18nLoader(defaultLocale);
};

export default i18nLoaderMultiple;
