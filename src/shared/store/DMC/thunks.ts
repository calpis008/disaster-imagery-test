import { selectMapCenter } from '../Map/selectors';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { ImageryScene, availableImageryScenesUpdated } from '../ImageryScene/reducer';
import { DateRange } from '@typing/shared';
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
            const center = selectMapCenter(getState());

            const scenes = await getDMCScenes({
                acquisitionDateRange,
                mapPoint: center,
                abortController,
            });

            const imageryScenes: ImageryScene[] = scenes.map(convertDMCSceneToImageryScene);
            dispatch(availableImageryScenesUpdated(imageryScenes));
        } catch (err) {
            console.error(err);
        }
    };
