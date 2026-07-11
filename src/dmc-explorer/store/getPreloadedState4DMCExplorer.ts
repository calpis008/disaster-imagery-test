import { PartialRootState } from '@shared/store/configureStore';
import { getPreloadedState4Map } from '@shared/store/Map/getPreloadedState';
import { getPreloadedState4UI } from '@shared/store/UI/getPreloadedState';
import { getPreloadedState4ChangeCompareTool } from '@shared/store/ChangeCompareTool/getPreloadedState';
import { getPreloadedTrendToolState } from '@shared/store/TrendTool/getPreloadedState';
import { getPreloadedState4MaskTool } from '@shared/store/MaskTool/getPrelaodedState';
import { getPreloadedState4ImageryScenes } from '@shared/store/ImageryScene/getPreloadedState';
import { getPreloadedState4PublishAndDownloadJobs } from '@shared/store/PublishAndDownloadJobs/getPreloadedState';
import { getMapCenterFromHashParams } from '@shared/utils/url-hash-params';
import { getTimeExtentOfDMCService } from '@shared/services/dmc/getTimeExtent';
import { getPreloadedState4ImageryService } from '@shared/store/ImageryService/getPrelaodedState';
import { InterestingPlaceData } from '@typing/shared';

const TAIWAN_DEFAULT_LOCATION: InterestingPlaceData = {
    key: 'taiwan',
    name: 'Taiwan',
    label: 'Taiwan',
    location: {
        center: [121.0, 23.5],
        zoom: 9,
    },
    renderer: '',
    thumbnail: '',
};

export const getPreloadedState = async (): Promise<PartialRootState> => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const mapLocationFromHashParams = getMapCenterFromHashParams(hashParams);

    const defaultLocation = !mapLocationFromHashParams
        ? TAIWAN_DEFAULT_LOCATION
        : null;

    const timeExtent = await getTimeExtentOfDMCService();

    const preloadedState: PartialRootState = {
        Map: getPreloadedState4Map(hashParams, defaultLocation),
        UI: getPreloadedState4UI(hashParams, defaultLocation),
        ImageryScenes: getPreloadedState4ImageryScenes(
            hashParams,
            defaultLocation,
            null
        ),
        ChangeCompareTool: getPreloadedState4ChangeCompareTool(hashParams),
        TrendTool: getPreloadedTrendToolState(hashParams),
        MaskTool: getPreloadedState4MaskTool(hashParams),
        PublishAndDownloadJobs: await getPreloadedState4PublishAndDownloadJobs(),
        ImageryService: getPreloadedState4ImageryService(timeExtent, []),
    };

    return preloadedState;
};
