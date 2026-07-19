/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';

import EsriMap from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import Extent from '@arcgis/core/geometry/Extent';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';

import { useAppSelector } from '@shared/store/configureStore';
import {
    selectDemForSelectedEvent,
    selectIs3DOn,
} from '@shared/store/Scene3D/selectors';
import { selectSelectedEventName } from '@shared/store/DisasterImageryExplorer/selectors';
import { selectQueryParams4SceneInSelectedMode } from '@shared/store/ImageryScene/selectors';
import { DISASTER_RESPONSE_IMAGERY_SERVICE_URL } from '@shared/services/disaster-response/config';
import { getObjectIdsForEvent } from '@shared/services/disaster-response/getObjectIdsForEvent';
import { LOCAL_SCENE_SPATIAL_REFERENCE_WKID } from '@shared/services/dem/config';

/**
 * Builds a `lock-raster` mosaic rule for one or more object ids. Used both for a single
 * selected scene and for "whole event" coverage (all of the event's rasters locked together).
 *
 * Filtering the 3D ImageryLayer via `definitionExpression`/a `where`-based mosaic rule on the
 * `DisasterEvent` string field was found (2026-07-19) to make the 3D `ImageryLayerView`'s
 * `exportImage` request hang/abort indefinitely on this ArcGIS Server instance — even though
 * the exact same request succeeds when issued directly via `fetch()`, and the exact same
 * filter works fine for the 2D `MapView`. `lockRasterIds` (keyed off the indexed OBJECTID
 * primary key, same mechanism already used for single-scene selection) does not hit this
 * problem, so it's used for both cases here instead.
 */
const getLockRasterMosaicRule = (objectIds: number[]): MosaicRule =>
    new MosaicRule({
        method: 'lock-raster',
        ascending: false,
        where: `objectid in (${objectIds.join(',')})`,
        lockRasterIds: objectIds,
    });

/**
 * 3D 視角切換：疊在 2D MapView 之上的 SceneView 容器。
 *
 * 使用 local scene（`viewingMode:'local'`、`spatialReference` 取自 DEM 服務自身回報的 wkid，
 * 例如 TWD97 TM2 對應的 102443/3826）搭配該事件對應的 DEM（`ElevationLayer`，掛在
 * `map.ground.layers`）呈現立體地形，並疊上分署 DMC III 航攝動態鑲嵌服務（`ImageryLayer`）——
 * 依目前選定場景（若有）鎖定該張影像，否則以整個事件所有影像的 objectId 清單組成
 * lockRasterIds（見上方 `getLockRasterMosaicRule` 註解，說明為何不用 definitionExpression）。
 *
 * 全球場景（Web Mercator）掛此 DEM 會失敗（ElevationLayerView resolve error），這是 2026-07-19
 * PoC 已驗證過的限制，因此一律以 local scene 呈現，不嘗試在既有 2D MapView 的 Map 上直接加
 * ElevationLayer。
 *
 * 2D MapView 容器維持掛載、不銷毀；本元件只是疊加在其上層的另一個 view，關閉 3D 時整個
 * SceneView（及其 container）被銷毀，2D 狀態不受影響。
 */
export const Scene3DView: FC = () => {
    const is3DOn = useAppSelector(selectIs3DOn);

    const demForSelectedEvent = useAppSelector(selectDemForSelectedEvent);

    const selectedEvent = useAppSelector(selectSelectedEventName);

    const { objectIdOfSelectedScene } =
        useAppSelector(selectQueryParams4SceneInSelectedMode) || {};

    const containerRef = useRef<HTMLDivElement>(null);

    const sceneViewRef = useRef<SceneView>(null);

    const imageryLayerRef = useRef<ImageryLayer>(null);

    /**
     * Tracks the filter (event/scene) that WE last applied to `imageryLayerRef.current`, so
     * the sync effect below only re-fetches/re-applies when the requested filter actually
     * differs from what was applied before (avoids redundant `mosaicRule` reassignments,
     * each of which cancels any in-flight `exportImage` request).
     */
    const appliedFilterRef = useRef<{
        objectId: number | null;
        event: string | null;
    }>({ objectId: null, event: null });

    const shouldShow3D = is3DOn && !!demForSelectedEvent;

    /**
     * Applies the current selection (single scene, or whole event) as a `lockRasterIds`
     * mosaic rule on the given layer. For the whole-event case this needs an extra query to
     * list the event's object ids (see module doc comment for why), so this is async; `stale`
     * is checked after the await so a superseded call (event changed again, or the view was
     * torn down) doesn't clobber a newer one.
     */
    const applyFilter = async (
        layer: ImageryLayer,
        objectId: number | null,
        eventName: string | null,
        stale: () => boolean
    ) => {
        if (objectId) {
            layer.mosaicRule = getLockRasterMosaicRule([objectId]);
            layer.definitionExpression = null;
            appliedFilterRef.current = { objectId, event: null };
            return;
        }

        if (!eventName) {
            return;
        }

        try {
            const objectIds = await getObjectIdsForEvent(eventName);

            if (stale() || !objectIds.length) {
                return;
            }

            layer.mosaicRule = getLockRasterMosaicRule(objectIds);
            layer.definitionExpression = null;
            appliedFilterRef.current = { objectId: null, event: eventName };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
                `Scene3DView: failed to fetch object ids for event "${eventName}":`,
                error
            );
        }
    };

    /**
     * Creates (or tears down) the SceneView whenever 3D mode is toggled on/off or the DEM
     * for the selected event changes (e.g. user switches to a different event that has a
     * different matching DEM).
     */
    useEffect(() => {
        if (!shouldShow3D || !containerRef.current) {
            return;
        }

        let isCancelled = false;

        const demExtentSource = demForSelectedEvent.extent;

        const demWkid =
            demExtentSource.spatialReference?.wkid ||
            LOCAL_SCENE_SPATIAL_REFERENCE_WKID;

        const spatialReference = new SpatialReference({ wkid: demWkid });

        const demExtent = new Extent({
            xmin: demExtentSource.xmin,
            ymin: demExtentSource.ymin,
            xmax: demExtentSource.xmax,
            ymax: demExtentSource.ymax,
            spatialReference,
        });

        const elevationLayer = new ElevationLayer({
            url: demForSelectedEvent.url,
        });

        const imageryLayer = new ImageryLayer({
            url: DISASTER_RESPONSE_IMAGERY_SERVICE_URL,
            elevationInfo: { mode: 'on-the-ground' },
        });

        imageryLayerRef.current = imageryLayer;
        appliedFilterRef.current = { objectId: null, event: null };

        applyFilter(
            imageryLayer,
            objectIdOfSelectedScene,
            selectedEvent,
            () => isCancelled
        );

        const map = new EsriMap({
            ground: {
                layers: [elevationLayer],
            },
            layers: [imageryLayer],
        });

        const view = new SceneView({
            container: containerRef.current,
            map,
            viewingMode: 'local',
            spatialReference,
            popupEnabled: false,
            ui: {
                components: ['zoom'],
            },
        });

        sceneViewRef.current = view;

        view.when(undefined, (error) => {
            // eslint-disable-next-line no-console
            console.error('Scene3DView: view failed to load', error);
        });

        view.when(() => {
            const expandedExtent = demExtent.clone().expand(1.2);

            // Step 1: frame the DEM extent top-down (this also picks a sensible camera
            // distance/scale for the extent's size).
            // Step 2: tilt to an oblique angle by passing a *partial* viewpoint (just
            // `target`/`tilt`/`heading`) rather than a mutated Camera clone — this keeps the
            // same look-at target on the ground and rotates the camera around it. Mutating a
            // cloned Camera's `tilt` while keeping its `position` fixed instead swings the
            // camera to look far past the terrain (out toward the horizon/sky), which is why
            // the scene rendered blank.
            view.goTo(expandedExtent, { animate: false })
                .then(() =>
                    view.goTo(
                        { target: demExtent.center, tilt: 55, heading: 0 },
                        { animate: false }
                    )
                )
                .catch((error) => {
                    if (error?.name !== 'view:goto-canceled') {
                        // eslint-disable-next-line no-console
                        console.error(
                            'Failed to set initial 3D camera position:',
                            error
                        );
                    }
                });
        });

        return () => {
            isCancelled = true;

            imageryLayerRef.current = null;

            if (sceneViewRef.current) {
                sceneViewRef.current.container = null;
                sceneViewRef.current.destroy();
                sceneViewRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldShow3D, demForSelectedEvent?.url]);

    /**
     * Keeps the ImageryLayer's filter in sync with the selected event/scene without
     * rebuilding the whole SceneView. The initial filter is already applied when the layer
     * is constructed (see the effect above, which also seeds `appliedFilterRef`), so this
     * only needs to act when the requested filter actually differs from what was last
     * applied.
     */
    useEffect(() => {
        if (!imageryLayerRef.current || !shouldShow3D) {
            return;
        }

        const alreadyApplied =
            appliedFilterRef.current.objectId ===
                (objectIdOfSelectedScene ?? null) &&
            appliedFilterRef.current.event ===
                (objectIdOfSelectedScene ? null : selectedEvent);

        if (alreadyApplied) {
            return;
        }

        let isCancelled = false;

        applyFilter(
            imageryLayerRef.current,
            objectIdOfSelectedScene,
            selectedEvent,
            () => isCancelled
        );

        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEvent, objectIdOfSelectedScene, shouldShow3D]);

    return (
        <div
            ref={containerRef}
            className={classNames('absolute top-0 left-0 w-full h-full', {
                hidden: !shouldShow3D,
            })}
        />
    );
};

export default Scene3DView;
