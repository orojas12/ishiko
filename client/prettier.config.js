/** @type {import("prettier").Config} */
const config = {
    tabWidth: 4,
    overrides: [
        {
            files: "*.yml",
            options: {
                tabWidth: 2,
            },
        },
    ],
};

module.exports = config;
