import { AppName } from '@shared/config';
import config from '../../config.json';

export type ImageryExplorerAppInfo = {
    appName: AppName;
    title: string;
    url: string;
    tooltip?: string;
};

// Dev ports for local testing — must match package.json start scripts
const DEV_PORTS: Partial<Record<AppName, number>> = {
    dmcexplorer: 8080,
    fs8explorer: 8081,
    sentinel2explorer: 8082,
};

const getAppUrl = (appName: AppName, pathname: string): string => {
    if (
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
    ) {
        return `https://localhost:${DEV_PORTS[appName]}/`;
    }
    return pathname;
};

const LIVING_ATLAS_SENTINEL2_URL =
    'https://livingatlas.arcgis.com/sentinel2explorer/';

const isLocalhost =
    typeof window !== 'undefined' &&
    window.location.hostname === 'localhost';

export const useDataOfImageryExplorerApps = (): ImageryExplorerAppInfo[] => {
    return [
        {
            appName: 'dmcexplorer',
            title: 'DMC III 航攝影像',
            url: getAppUrl('dmcexplorer', config.dmcexplorer.pathname),
            tooltip: '切換至 DMC III 航攝影像探索',
        },
        {
            appName: 'fs8explorer',
            title: '福衛八號影像',
            url: getAppUrl('fs8explorer', config.fs8explorer.pathname),
            tooltip: '切換至福衛八號影像探索',
        },
        {
            appName: 'sentinel2explorer',
            title: 'Sentinel-2',
            // Dev: open Living Atlas directly (new tab)
            // Prod: navigate to local iframe wrapper page (same tab)
            url: isLocalhost
                ? LIVING_ATLAS_SENTINEL2_URL
                : config.sentinel2explorer.pathname,
            tooltip: 'Sentinel-2 Explorer (Esri Living Atlas)',
        },
    ];
};

export const useDataOfImageryUtilityApps = () => {
    return [] as ImageryExplorerAppInfo[];
};
