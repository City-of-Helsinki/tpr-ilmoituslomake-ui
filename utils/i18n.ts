export const defaultLocale = "fi";

const i18nLoader = async (locale?: string): Promise<{ [key: string]: unknown }> => {
  const { default: lngDict = {} } = await import(`../locales/${locale || defaultLocale}.json`);
  return lngDict;
};

export default i18nLoader;
