import { AppName } from '@shared/config';

export type ImageryExplorerAppInfo = {
    appName: AppName;
    title: string;
    url: string;
    tooltip?: string;
};

/**
 * ASRS 災害影像探索器為獨立單一應用，不再提供切換至其他衛星影像 App 的清單。
 * 保留此 hook 介面是為了讓 AppHeader/AgencyHeader 等共用元件維持相同呼叫方式。
 */
export const useDataOfImageryExplorerApps = (): ImageryExplorerAppInfo[] => {
    return [];
};

export const useDataOfImageryUtilityApps = (): ImageryExplorerAppInfo[] => {
    return [];
};
