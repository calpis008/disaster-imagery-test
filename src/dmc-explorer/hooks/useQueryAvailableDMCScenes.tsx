import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@shared/store/configureStore';
import { selectMapCenter } from '@shared/store/Map/selectors';
import { selectIsAnimationPlaying } from '@shared/store/UI/selectors';
import { selectQueryParams4SceneInSelectedMode } from '@shared/store/ImageryScene/selectors';
import { queryAvailableDMCScenes } from '../store/thunks';

export const useQueryAvailableDMCScenes = (): void => {
    const dispatch = useAppDispatch();

    const queryParams = useAppSelector(selectQueryParams4SceneInSelectedMode);
    const acquisitionDateRange = queryParams?.acquisitionDateRange;
    const isAnimationPlaying = useAppSelector(selectIsAnimationPlaying);
    const center = useAppSelector(selectMapCenter);

    useEffect(() => {
        if (!center || !acquisitionDateRange) {
            return;
        }

        if (isAnimationPlaying) {
            return;
        }

        dispatch(queryAvailableDMCScenes(acquisitionDateRange));
    }, [center, acquisitionDateRange, isAnimationPlaying]);

    return null;
};
