module.exports = {
  i18n: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    localeDetection: false,
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/:method*/",
        destination: "http://localhost:8008/api/:method*/",
      },
    ];
  },
};
