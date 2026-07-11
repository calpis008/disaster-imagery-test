import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@shared/store/configureStore';
import { selectMapCenter } from '@shared/store/Map/selectors';
import { selectIsAnimationPlaying } from '@shared/store/UI/selectors';
import { selectQueryParams4SceneInSelectedMode } from '@shared/store/ImageryScene/selectors';
import { queryAvailableDMCScenes } from '@shared/store/DMC/thunks';
import { queryAvailableFS8Scenes } from '@shared/store/FS8/thunks';
import { queryAvailableSentinel2Scenes } from '@shared/store/Sentinel2/thunks';
import { useSelectedService } from '../context/SelectedServiceContext';

export const useQueryAvailableScenes = (): void => {
    const dispatch = useAppDispatch();
    const { selectedService } = useSelectedService();

    const queryParams = useAppSelector(selectQueryParams4SceneInSelectedMode);
    const acquisitionDateRange = queryParams?.acquisitionDateRange;
    const isAnimationPlaying = useAppSelector(selectIsAnimationPlaying);
    const center = useAppSelector(selectMapCenter);

    useEffect(() => {
        if (!center || !acquisitionDateRange || isAnimationPlaying) {
            return;
        }

        if (selectedService === 'dmc') {
            dispatch(queryAvailableDMCScenes(acquisitionDateRange));
        } else if (selectedService === 'fs8') {
            dispatch(queryAvailableFS8Scenes(acquisitionDateRange));
        } else if (selectedService === 'sentinel2') {
            dispatch(queryAvailableSentinel2Scenes(acquisitionDateRange));
        }
    }, [center, acquisitionDateRange, isAnimationPlaying, selectedService]);

    return null;
};
