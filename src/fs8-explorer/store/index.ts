import configureAppStore from '@shared/store/configureStore';
import { getPreloadedState } from './getPreloadedState4FS8Explorer';

export const getFS8ExplorerStore = async () => {
    const preloadedState = await getPreloadedState();
    return configureAppStore(preloadedState);
};
