import { AppName } from '@shared/config';
import config from '../../config.json';

export type ImageryExplorerAppInfo = {
    appName: AppName;
    title: string;
    url: string;
    tooltip?: string;
};

export const useDataOfImageryExplorerApps = (): ImageryExplorerAppInfo[] => {
    return [
        {
            appName: 'dmcexplorer',
            title: 'DMC III 航攝影像',
            url: config.dmcexplorer.pathname,
            tooltip: '切換至 DMC III 航攝影像探索',
        },
        {
            appName: 'fs8explorer',
            title: '福衛八號影像',
            url: config.fs8explorer.pathname,
            tooltip: '切換至福衛八號影像探索',
        },
        {
            appName: 'sentinel2explorer',
            title: 'Sentinel-2',
            url: config.sentinel2explorer.pathname,
            tooltip: '切換至 Sentinel-2 Explorer',
        },
    ];
};

export const useDataOfImageryUtilityApps = () => {
    return [] as ImageryExplorerAppInfo[];
};
