module.exports = {
  i18n: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
  },
  async rewrites() {
    return [
      {
        source: "/backend/api/:method",
        destination: "http://localhost:8008/api/:method/",
      },
    ];
  },
};
