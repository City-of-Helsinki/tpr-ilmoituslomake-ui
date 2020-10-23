module.exports = {
  async rewrites() {
    return [
      {
        source: "/backend/api/:method",
        destination: "http://localhost:8008/api/:method/",
      },
    ];
  },
};
