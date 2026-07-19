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

/**
 * 內政部國土測繪中心（NLSC）WMTS 服務設定。
 *
 * 2026-07-19 以 GetCapabilities 實測確認：
 * - WMTS 端點：https://wmts.nlsc.gov.tw/wmts
 * - 圖層「臺灣通用電子地圖透明」的 identifier 為 EMAP2，格式 image/png（背景透明）
 * - TileMatrixSet 為標準 GoogleMapsCompatible（EPSG:3857 Web Mercator，z/y/x 與 Esri
 *   預設 TileInfo 相容），因此改用 WebTileLayer + urlTemplate 直接組 RESTful tile URL，
 *   不透過 WMTSLayer 解析 capabilities（避免該 SDK 版本對此服務 capabilities 解析異常的風險）。
 */

const NLSC_WMTS_BASE_URL_DEFAULT = 'https://wmts.nlsc.gov.tw/wmts';

const NLSC_EMAP_LAYER_ID_DEFAULT = 'EMAP2';

/**
 * NLSC WMTS 服務根網址，可由 .env 的 NLSC_WMTS_BASE_URL 覆寫。
 */
export const NLSC_WMTS_BASE_URL =
    ENV_NLSC_WMTS_BASE_URL || NLSC_WMTS_BASE_URL_DEFAULT;

/**
 * 「臺灣通用電子地圖透明」圖層 identifier，可由 .env 的 NLSC_EMAP_LAYER_ID 覆寫。
 */
export const NLSC_EMAP_LAYER_ID =
    ENV_NLSC_EMAP_LAYER_ID || NLSC_EMAP_LAYER_ID_DEFAULT;

/**
 * RESTful tile URL 樣板（GoogleMapsCompatible TileMatrixSet，Style 固定為 default）。
 * `{level}`/`{row}`/`{col}` 為 ArcGIS JS API WebTileLayer 的標準 tile 座標佔位字串。
 */
export const NLSC_EMAP_TILE_URL_TEMPLATE = `${NLSC_WMTS_BASE_URL}/${NLSC_EMAP_LAYER_ID}/default/GoogleMapsCompatible/{level}/{row}/{col}`;

/**
 * 圖層顯示名稱（供 title/attribution 使用）。
 */
export const NLSC_EMAP_LAYER_TITLE = '臺灣通用電子地圖透明（國土測繪中心）';

/**
 * 圖資來源標示（供 CustomMapArrtribution 疊加使用）。
 */
export const NLSC_EMAP_ATTRIBUTION = '圖資來源：內政部國土測繪中心';
