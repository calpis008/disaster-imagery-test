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
            url: getAppUrl('sentinel2explorer', config.sentinel2explorer.pathname),
            tooltip: '切換至 Sentinel-2 Explorer',
        },
    ];
};

export const useDataOfImageryUtilityApps = () => {
    return [] as ImageryExplorerAppInfo[];
};
