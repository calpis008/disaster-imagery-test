import { AppName, APP_NAME } from '@shared/config';
import config from '../../config.json';

/**
 * Type representing the information for an Imagery Explorer App.
 * This type includes the app name, title, URL, and an optional tooltip.
 */
export type ImageryExplorerAppInfo = {
    appName: AppName;
    title: string;
    url: string;
    tooltip?: string; // Optional tooltip for the app
};

/**
 * Custom hook that provides data for Imagery Explorer Apps.
 *
 * This hook uses the `useTranslation` hook to get the translation function `t`
 * and returns a memoized array of objects containing information about different
 * imagery explorer applications.
 *
 * Each object in the array contains:
 * - `appName`: The name of the application.
 * - `title`: The translated title of the application.
 * - `url`: The URL path to the application.
 *
 * @returns {Array<{ appName: AppName; title: string; url: string }>} An array of objects containing app data.
 */
export const useDataOfImageryExplorerApps = () => {
    // Unified explorer contains all services inline — no cross-app links needed
    if (APP_NAME === 'unifiedexplorer') return [] as ImageryExplorerAppInfo[];

    const data: ImageryExplorerAppInfo[] = [
        {
            appName: 'dmcexplorer',
            title: 'DMC III 航攝影像探索',
            url: config.dmcexplorer.pathname,
            tooltip: '在新分頁開啟 DMC III 航攝影像探索',
        },
        {
            appName: 'fs8explorer',
            title: '福衛八號影像探索',
            url: config.fs8explorer.pathname,
            tooltip: '在新分頁開啟福衛八號影像探索',
        },
        {
            appName: 'sentinel2explorer',
            title: 'Sentinel-2 Explorer',
            url: config.sentinel2explorer.pathname,
            tooltip: 'Launch the Sentinel-2 Explorer in a new tab',
        },
    ];

    return data;
};

export const useDataOfImageryUtilityApps = () => {
    return [] as ImageryExplorerAppInfo[];
};
