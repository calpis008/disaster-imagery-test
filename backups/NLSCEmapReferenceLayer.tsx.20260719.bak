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

import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import {
    NLSC_EMAP_TILE_URL_TEMPLATE,
    NLSC_EMAP_LAYER_TITLE,
    NLSC_EMAP_ATTRIBUTION,
} from '@shared/services/nlsc/config';

type Props = {
    mapView?: MapView;
};

/**
 * 建立內政部國土測繪中心（NLSC）「臺灣通用電子地圖透明」（EMAP2）WebTileLayer。
 *
 * 此圖層背景透明，疊在災害航攝影像圖層之上做為道路／地名參照層，因此不提供顯示/隱藏
 * 開關（常駐顯示），與 HillshadeLayer 等其他參考圖層元件同樣採「index.ts + 元件」慣例。
 */
export const getNLSCEmapLayer = () => {
    return new WebTileLayer({
        title: NLSC_EMAP_LAYER_TITLE,
        urlTemplate: NLSC_EMAP_TILE_URL_TEMPLATE,
        copyright: NLSC_EMAP_ATTRIBUTION,
    });
};

export const NLSCEmapReferenceLayer: FC<Props> = ({ mapView }) => {
    const emapLayerRef = useRef<WebTileLayer>(null);

    const init = () => {
        emapLayerRef.current = getNLSCEmapLayer();

        // 不指定 index：add() 預設加到圖層堆疊最上層，
        // 確保透明電子地圖疊在災害影像／地形量影圖層之上作為道路地名參照。
        mapView.map.add(emapLayerRef.current);
    };

    useEffect(() => {
        if (mapView) {
            init();
        }

        return () => {
            if (emapLayerRef.current) {
                mapView?.map?.remove(emapLayerRef.current);
                emapLayerRef.current.destroy();
                emapLayerRef.current = null;
            }
        };
    }, [mapView]);

    return null;
};

export default NLSCEmapReferenceLayer;
