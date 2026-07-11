import configureAppStore from '@shared/store/configureStore';
import { getPreloadedState } from './getPreloadedState4UnifiedExplorer';

export const getUnifiedExplorerStore = async () => {
    const preloadedState = await getPreloadedState();
    return configureAppStore(preloadedState);
};
