import MapView from '@arcgis/core/views/MapView';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import { useAppSelector } from '@shared/store/configureStore';
import {
    selectAvailableScenes,
    selectQueryParams4SceneInSelectedMode,
    selectAppMode,
} from '@shared/store/ImageryScene/selectors';
import { selectAnimationStatus } from '@shared/store/UI/selectors';
import {
    DMC_SERVICE_URL,
    DMC_SERVICE_SORT_FIELD,
    DMC_SERVICE_SORT_VALUE,
} from '@shared/services/dmc/config';

type Props = {
    mapView?: MapView;
    groupLayer?: GroupLayer;
};

export const DMCLayer: FC<Props> = ({ mapView, groupLayer }: Props) => {
    const layerRef = useRef<ImageryLayer>(null);
    const [layer, setLayer] = useState<ImageryLayer>(null);

    const mode = useAppSelector(selectAppMode);
    const queryParams = useAppSelector(selectQueryParams4SceneInSelectedMode);
    const { acquisitionDate, objectIdOfSelectedScene, rasterFunctionName } =
        queryParams || {};
    const availableScenes = useAppSelector(selectAvailableScenes);
    const animationStatus = useAppSelector(selectAnimationStatus);

    // All scenes at the center point for the selected date
    const scenesForDate = useMemo(() => {
        if (!acquisitionDate) return [];
        return availableScenes.filter(
            (s) => s.formattedAcquisitionDate === acquisitionDate
        );
    }, [availableScenes, acquisitionDate]);

    const allObjectIds = useMemo(
        () => scenesForDate.map((s) => s.objectId),
        [scenesForDate]
    );

    const defaultMosaicRule = useMemo(
        () =>
            new MosaicRule({
                ascending: true,
                method: 'attribute',
                operation: 'first',
                sortField: DMC_SERVICE_SORT_FIELD,
                sortValue: DMC_SERVICE_SORT_VALUE,
            }),
        []
    );

    const getMosaicRule = (): MosaicRule => {
        // dynamic: always use attribute-based mosaic (same as Sentinel-2 dynamic mode)
        if (mode === 'dynamic') return defaultMosaicRule;
        // find-a-scene / animate: show ALL overlapping scenes for the selected date simultaneously
        if (
            (mode === 'find a scene' || mode === 'animate') &&
            allObjectIds.length > 0
        ) {
            return new MosaicRule({
                method: 'lock-raster',
                ascending: true,
                where: `objectid in (${allObjectIds.join(',')})`,
                lockRasterIds: allObjectIds,
            });
        }
        // swipe / analysis: lock to the single selected scene
        if (objectIdOfSelectedScene) {
            return new MosaicRule({
                method: 'lock-raster',
                ascending: false,
                where: `objectid in (${objectIdOfSelectedScene})`,
                lockRasterIds: [objectIdOfSelectedScene],
            });
        }
        return defaultMosaicRule;
    };

    const getVisible = (): boolean => {
        if (mode === 'dynamic') return true;
        if (mode === 'find a scene') return allObjectIds.length > 0;
        if (mode === 'animate') {
            return allObjectIds.length > 0 && animationStatus === null;
        }
        // swipe mode: SwipeComponent4ImageryLayers manages its own layers
        if (mode === 'swipe') return false;
        return !!objectIdOfSelectedScene;
    };

    // Initialize layer once
    useEffect(() => {
        if (layerRef.current) return;
        layerRef.current = new ImageryLayer({
            url: DMC_SERVICE_URL,
            mosaicRule: defaultMosaicRule,
            rasterFunction: { functionName: rasterFunctionName },
            visible: false,
        });
        setLayer(layerRef.current);
    }, []);

    // Update mosaic rule and visibility when relevant state changes
    useEffect(() => {
        if (!layerRef.current) return;
        layerRef.current.mosaicRule = getMosaicRule() as any;
        layerRef.current.visible = getVisible();
    }, [allObjectIds, objectIdOfSelectedScene, mode, animationStatus]);

    // Update raster function
    useEffect(() => {
        if (!layerRef.current || !rasterFunctionName) return;
        layerRef.current.rasterFunction = {
            functionName: rasterFunctionName,
        } as any;
    }, [rasterFunctionName]);

    // Add to group layer
    useEffect(() => {
        if (groupLayer && layer) {
            groupLayer.add(layer);
            groupLayer.reorder(layer, 0);
        }
    }, [groupLayer, layer]);

    return null;
};
