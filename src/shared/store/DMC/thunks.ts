import { selectMapCenter } from '../Map/selectors';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { ImageryScene, availableImageryScenesUpdated } from '../ImageryScene/reducer';
import { DateRange } from '@typing/shared';
import { selectQueryParams4SceneInSelectedMode } from '../ImageryScene/selectors';
import { deduplicateListOfImageryScenes } from '@shared/services/helpers/deduplicateListOfScenes';
import { getDMCScenes } from '@shared/services/dmc/getDMCScenes';
import { convertDMCSceneToImageryScene } from '@shared/services/dmc/helpers';

let abortController: AbortController = null;

export const queryAvailableDMCScenes =
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

            const scenes = await getDMCScenes({
                acquisitionDateRange,
                mapPoint: center,
                abortController,
            });

            let imageryScenes: ImageryScene[] = scenes.map(convertDMCSceneToImageryScene);
            imageryScenes = deduplicateListOfImageryScenes(imageryScenes, objectIdOfSelectedScene);
            dispatch(availableImageryScenesUpdated(imageryScenes));
        } catch (err) {
            console.error(err);
        }
    };
