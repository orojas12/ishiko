/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  // development use only
  async rewrites() {
    return [
      {
        source: "/api/csrf",
        destination: "http://localhost:8080/csrf",
      },
      {
        source: "/api/login",
        destination: "http://localhost:8080/login",
      },
      {
        source: "/api/user",
        destination: "http://localhost:8080/user",
      },
      {
        source: "/api/projects",
        destination: "http://localhost:8080/projects",
      },
    ];
  },
};
