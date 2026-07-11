import { selectMapCenter } from '../Map/selectors';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { ImageryScene, availableImageryScenesUpdated } from '../ImageryScene/reducer';
import { DateRange } from '@typing/shared';
import { selectQueryParams4SceneInSelectedMode } from '../ImageryScene/selectors';
import { deduplicateListOfImageryScenes } from '@shared/services/helpers/deduplicateListOfScenes';
import { getFS8Scenes } from '@shared/services/fs8/getFS8Scenes';
import { convertFS8SceneToImageryScene } from '@shared/services/fs8/helpers';

let abortController: AbortController = null;

export const queryAvailableFS8Scenes =
    (acquisitionDateRange: DateRange) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        if (!acquisitionDateRange) return;

        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();

        try {
            const { objectIdOfSelectedScene } =
                selectQueryParams4SceneInSelectedMode(getState()) || {};
            const center = selectMapCenter(getState());

            const scenes = await getFS8Scenes({
                acquisitionDateRange,
                mapPoint: center,
                abortController,
            });

            let imageryScenes: ImageryScene[] = scenes.map(convertFS8SceneToImageryScene);
            imageryScenes = deduplicateListOfImageryScenes(imageryScenes, objectIdOfSelectedScene);
            dispatch(availableImageryScenesUpdated(imageryScenes));
        } catch (err) {
            console.error(err);
        }
    };
