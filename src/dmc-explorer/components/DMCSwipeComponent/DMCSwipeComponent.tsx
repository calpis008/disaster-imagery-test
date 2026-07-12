import MapView from '@arcgis/core/views/MapView';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import { useAppSelector, useAppDispatch } from '@shared/store/configureStore';
import {
    selectAvailableScenes,
    selectQueryParams4MainScene,
    selectQueryParams4SecondaryScene,
    selectIsSceneToSceneSwipeVisible,
} from '@shared/store/ImageryScene/selectors';
import { swipeWidgetHanlderPositionChanged } from '@shared/store/Map/reducer';
import { SwipeComponent } from '@shared/components/SwipeWidget/SwipeComponent';
import { DMC_SERVICE_URL } from '@shared/services/dmc/config';
import { ImageryScene } from '@shared/store/ImageryScene/reducer';

const getMultiSceneMosaicRule = (objectIds: number[]): MosaicRule | null => {
    if (!objectIds || objectIds.length === 0) return null;
    return new MosaicRule({
        method: 'lock-raster',
        ascending: true,
        where: `objectid in (${objectIds.join(',')})`,
        lockRasterIds: objectIds,
    });
};

const useDMCSwipeLayer = (
    acquisitionDate: string | undefined,
    availableScenes: ImageryScene[],
    rasterFunctionName: string,
    visible: boolean
) => {
    const layerRef = useRef<ImageryLayer>(null);
    const [layer, setLayer] = useState<ImageryLayer>(null);

    const objectIds = useMemo(() => {
        if (!acquisitionDate) return [] as number[];
        return availableScenes
            .filter((s) => s.formattedAcquisitionDate === acquisitionDate)
            .map((s) => s.objectId);
    }, [availableScenes, acquisitionDate]);

    // Initialize layer once
    useEffect(() => {
        if (layerRef.current) return;
        layerRef.current = new ImageryLayer({
            url: DMC_SERVICE_URL,
            mosaicRule: getMultiSceneMosaicRule(objectIds),
            rasterFunction: { functionName: rasterFunctionName },
            visible: false,
        });
        setLayer(layerRef.current);
    }, []);

    // Update mosaic rule and visibility when date / available scenes change
    useEffect(() => {
        if (!layerRef.current) return;
        const mosaicRule = getMultiSceneMosaicRule(objectIds);
        if (mosaicRule) {
            layerRef.current.mosaicRule = mosaicRule as any;
        }
        layerRef.current.visible = visible && objectIds.length > 0;
    }, [objectIds, visible]);

    // Update raster function
    useEffect(() => {
        if (!layerRef.current || !rasterFunctionName) return;
        layerRef.current.rasterFunction = {
            functionName: rasterFunctionName,
        } as any;
    }, [rasterFunctionName]);

    return layer;
};

type Props = {
    mapView?: MapView;
};

export const DMCSwipeComponent: FC<Props> = ({ mapView }: Props) => {
    const dispatch = useAppDispatch();

    const isSwipeWidgetVisible = useAppSelector(selectIsSceneToSceneSwipeVisible);
    const queryParams4LeftSide = useAppSelector(selectQueryParams4MainScene);
    const queryParams4RightSide = useAppSelector(selectQueryParams4SecondaryScene);
    const availableScenes = useAppSelector(selectAvailableScenes);

    const leadingLayer = useDMCSwipeLayer(
        queryParams4LeftSide?.acquisitionDate,
        availableScenes,
        queryParams4LeftSide?.rasterFunctionName || '',
        isSwipeWidgetVisible
    );

    const trailingLayer = useDMCSwipeLayer(
        queryParams4RightSide?.acquisitionDate,
        availableScenes,
        queryParams4RightSide?.rasterFunctionName || '',
        isSwipeWidgetVisible
    );

    useEffect(() => {
        if (!leadingLayer || !trailingLayer || !mapView) return;
        mapView.map.addMany([leadingLayer, trailingLayer]);
    }, [mapView, leadingLayer, trailingLayer]);

    return (
        <SwipeComponent
            mapView={mapView}
            visible={isSwipeWidgetVisible}
            leadingLayer={leadingLayer}
            trailingLayer={trailingLayer}
            positionOnChange={(pos) => {
                dispatch(swipeWidgetHanlderPositionChanged(Math.trunc(pos)));
            }}
        />
    );
};
