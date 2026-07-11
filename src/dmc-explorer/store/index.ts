import configureAppStore from '@shared/store/configureStore';
import { getPreloadedState } from './getPreloadedState4DMCExplorer';

export const getDMCExplorerStore = async () => {
    const preloadedState = await getPreloadedState();
    return configureAppStore(preloadedState);
};
