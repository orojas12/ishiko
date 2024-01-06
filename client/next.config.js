/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins:
                process.env.NODE_ENV === "development"
                    ? ["localhost:8000"]
                    : [],
        },
    },
};

module.exports = nextConfig;
