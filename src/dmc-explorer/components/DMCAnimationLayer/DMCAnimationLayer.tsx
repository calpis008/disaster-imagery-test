import React, { FC, useCallback, useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import MediaLayer from '@arcgis/core/layers/MediaLayer';
import { once } from '@arcgis/core/core/reactiveUtils';
import { useAppSelector, useAppDispatch } from '@shared/store/configureStore';
import { animationStatusChanged, animationSpeedChanged } from '@shared/store/UI/reducer';
import {
    selectAnimationStatus,
    selectAnimationSpeed,
} from '@shared/store/UI/selectors';
import {
    selectListOfQueryParams,
    selectAvailableScenes,
} from '@shared/store/ImageryScene/selectors';
import { selectedItemIdOfQueryParamsListChanged } from '@shared/store/ImageryScene/reducer';
import { sortQueryParams4ScenesByAcquisitionDate } from '@shared/components/AnimationControl/helpers';
import { AnimationFrameAcquisitionDateDisplayContainer } from '@shared/components/AnimationLayer/AnimationFrameAcquisitionDateDisplayContainer';
import { CloseButton } from '@shared/components/CloseButton';
import { AnimationSpeedControl } from '@shared/components/AnimationControl/AnimationSpeedControl';
import { PlayPauseButton } from '@shared/components/AnimationDownloadPanel/PlayPauseButton';
import useMediaLayerAnimation from '@shared/components/AnimationLayer/useMediaLayerAnimation';
import { DMCDownloadButton } from './DMCDownloadButton';
import { DMC_SERVICE_URL } from '@shared/services/dmc/config';
import useDMCMediaLayerImageElement from '../../hooks/useDMCMediaLayerImageElement';
import classNames from 'classnames';

type Props = {
    groupLayer?: GroupLayer;
    mapView?: MapView;
};

export const DMCAnimationLayer: FC<Props> = ({ groupLayer, mapView }) => {
    const dispatch = useAppDispatch();

    const mediaLayerRef = useRef<MediaLayer>(null);

    const animationStatus = useAppSelector(selectAnimationStatus);
    const animationSpeed = useAppSelector(selectAnimationSpeed);
    const availableScenes = useAppSelector(selectAvailableScenes);

    const queryParams4ScenesInAnimationMode = useAppSelector(
        selectListOfQueryParams
    );

    const sortedQueryParams = sortQueryParams4ScenesByAcquisitionDate(
        queryParams4ScenesInAnimationMode,
        true
    );

    const mediaLayerElements = useDMCMediaLayerImageElement({
        imageryServiceUrl: DMC_SERVICE_URL,
        mapView,
        animationStatus,
        queryParams4ImageryScenes: sortedQueryParams,
        availableScenes,
    });

    const activeFrameOnChange = useCallback(
        (indexOfActiveFrame: number) => {
            const queryParamsOfActiveFrame = sortedQueryParams[indexOfActiveFrame];
            dispatch(
                selectedItemIdOfQueryParamsListChanged(
                    queryParamsOfActiveFrame?.uniqueId
                )
            );
        },
        [sortedQueryParams]
    );

    useMediaLayerAnimation({
        animationStatus,
        animationSpeed,
        mediaLayerElements,
        activeFrameOnChange,
    });

    const initMediaLayer = async () => {
        try {
            mediaLayerRef.current = new MediaLayer({ visible: true });
            groupLayer.add(mediaLayerRef.current);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!mediaLayerRef.current) {
            initMediaLayer();
        }
    }, [groupLayer]);

    useEffect(() => {
        (async () => {
            if (!mediaLayerRef.current) return;

            const source = mediaLayerRef.current.source as any;
            source.elements.removeAll();

            if (!mediaLayerElements || mediaLayerElements.length === 0) return;

            try {
                for (const element of mediaLayerElements) {
                    source.elements.add(element);
                    await once(
                        () =>
                            element.loadStatus === 'loaded' ||
                            element.loadStatus === 'failed'
                    );
                    if (element.loadStatus === 'failed') {
                        throw new Error(`Element failed to load`);
                    }
                }
                dispatch(animationStatusChanged('playing'));
            } catch (error) {
                console.error('Error loading media layer elements:', error);
                dispatch(animationStatusChanged('failed-loading'));
            }
        })();
    }, [mediaLayerElements]);

    if (!animationStatus) return null;

    return (
        <div
            className={classNames(
                'absolute top-0 left-0 bottom-0 right-0 z-10 flex items-center justify-center'
            )}
        >
            {animationStatus === 'loading' && (
                <calcite-loader label="loading" scale="l" />
            )}

            <AnimationFrameAcquisitionDateDisplayContainer
                animationStatus={animationStatus}
            />

            <div className="absolute top-1 right-16 flex items-center text-custom-light-blue">
                <div className="h-[64px] pt-4 mr-2">
                    <AnimationSpeedControl
                        speed={animationSpeed}
                        onChange={(updatedSpeed) => {
                            dispatch(animationSpeedChanged(updatedSpeed));
                        }}
                        shouldUseEnhancedStyle={true}
                    />
                </div>
                {mediaLayerElements && mediaLayerElements.length > 0 && (
                    <DMCDownloadButton
                        mediaLayerElements={mediaLayerElements}
                        animationSpeed={animationSpeed}
                        mapWidth={mapView?.width ?? 1920}
                        mapHeight={mapView?.height ?? 1080}
                    />
                )}
                <PlayPauseButton />
            </div>

            <CloseButton
                onClick={() => {
                    dispatch(animationStatusChanged(null));
                }}
            />
        </div>
    );
};
