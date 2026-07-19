/**
 * 農業部林業及自然保育署（分署）DEM 高程快取服務目錄設定。
 *
 * 分署為每場災害事件發布一片事件 DEM（ImageServer，LERC 高程快取，cacheType Elevation、F32），
 * 命名慣例為 `DEM_*`（例如 `DEM_260708_tif`），皆發布在目錄根目錄下（無子資料夾）。
 *
 * 2026-07-19 實測：
 * - 目錄 `${DEM_CATALOG_URL}?f=json` 可匿名列舉（GeoServer REST catalog root，回傳
 *   `{ services: [{ name, type }, ...] }`）
 * - 全球場景（Web Mercator）掛此 DEM 會失敗（ElevationLayerView resolve error），
 *   必須用 local scene（viewingMode:'local'、spatialReference wkid:3826）
 */
const DEM_CATALOG_URL_DEFAULT =
    'https://gisportal.moa.gov.tw/geoserver/rest/services?f=json';

export const DEM_CATALOG_URL = ENV_DEM_CATALOG_URL || DEM_CATALOG_URL_DEFAULT;

const DEM_SERVICE_PREFIX_DEFAULT = 'DEM_';

export const DEM_SERVICE_PREFIX =
    ENV_DEM_SERVICE_PREFIX || DEM_SERVICE_PREFIX_DEFAULT;

/**
 * local scene 使用的空間參考（TWD97 / TM2 zone 121，EPSG:3826）。
 * 全球場景（Web Mercator）掛分署 DEM 高程快取會失敗，必須用這個 wkid 建立 local scene。
 */
export const LOCAL_SCENE_SPATIAL_REFERENCE_WKID = 3826;
