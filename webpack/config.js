/**
 * Entry point file paths by application.
 * The keys are application names that should match keys in src/config.json.
 */
const ENTRY_POINTS_BY_APP_NAME = {
    disasterimageryexplorer: '/src/disaster-imagery-explorer/index.tsx',
};

/**
 * environment variables by application.
 * The keys are application names that should match keys in src/config.json.
 */
const ENV_VARIABLES_BY_APP_NAME = {
    disasterimageryexplorer: [
        {
            name: 'DISASTER_IMAGERY_EXPLORER_APP_ID',
            required: true,
        },
        {
            name: 'DISASTER_RESPONSE_SERVICE_URL',
            required: true,
        }
    ],
};

module.exports = {
    ENTRY_POINTS_BY_APP_NAME,
    ENV_VARIABLES_BY_APP_NAME,
};
