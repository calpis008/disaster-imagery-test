const DISASTER_RESPONSE_IMAGERY_SERVICE_URL_DEFAULT =
    'https://edi.asrs.gov.tw/geoportal/sharing/servers/473e7b17fd4b4a3ebf37d27ad6afc9b9/rest/services/edi/DIMS_DMCIII_8_3/ImageServer';

export const DISASTER_RESPONSE_IMAGERY_SERVICE_URL =
    ENV_DISASTER_RESPONSE_SERVICE_URL ||
    DISASTER_RESPONSE_IMAGERY_SERVICE_URL_DEFAULT;

/**
 * List of Raster Functions for the Disaster Response imagery service.
 *
 * ASRS 分署自有的 DMC III 航攝動態鑲嵌服務（DIMS_DMCIII_8_3, portal item id
 * 473e7b17fd4b4a3ebf37d27ad6afc9b9）實測 `?f=json` 的 `rasterFunctionInfos` 只有一個
 * 名為 `None` 的項目（服務端預設，未發布任何具名 RFT，例如原 Esri drp_imagery 使用的
 * `Natural Color for Visualization - DRA` 在這個服務並不存在）。因此這裡改為空字串，
 * 代表不帶 renderingRule 參數／不強制指定 RFT，直接使用服務端預設輸出。
 * 若未來 ASRS 服務發布了具名 RFT，把它加進這個陣列並更新 DisasterResponseImageryServiceDefaultRenderer 即可。
 */
const DISASTER_RESPONSE_RASTER_FUNCTIONS = [''] as const;

export type DisasterResponseRasterFunctionName =
    (typeof DISASTER_RESPONSE_RASTER_FUNCTIONS)[number];

export const DisasterResponseImageryServiceDefaultRenderer: DisasterResponseRasterFunctionName =
    '';

/**
 * Centralized field-name mapping for the Disaster Response imagery service.
 *
 * ASRS 分署自有的 DMC III 服務（DIMS_DMCIII_8_3）欄位命名與原 Esri drp_imagery 示範服務不同，
 * 且部分欄位（event_start_date、title、description、provider、platform、event_type 等）
 * 在 ASRS 服務中並不存在。所有 disaster-response 底下的 service 函式一律經由這個物件存取欄位名稱，
 * 不要在查詢邏輯裡直接寫死欄位字串——未來如果要接其他感測器（例如衛星）的詮釋資料服務，
 * 只需要改這裡的對映值，查詢邏輯（where/outFields/outStatistics 等組法）不必變動。
 *
 * 對映依據：2026-07-19 對 ASRS 服務 `<serviceUrl>?f=json` 實測欄位清單：
 * OBJECTID, Name, MinPS, MaxPS, LowPS, HighPS, Category, Tag, GroupName, ProductName,
 * CenterX, CenterY, ZOrder, ImageType, Band, ImageDate, CloudCover, DisasterEvent,
 * CreatedDate, ImageOrder, Shape
 *
 * 注意：
 * - EVENT_START_DATE 沒有對應欄位，起始日改由 getEventStartDates.ts 以
 *   min(ImageDate) 逐事件推導（outStatistics + groupByFieldsForStatistics）。
 * - IMAGE_TYPE 對映到 ASRS 的 `ImageType` 欄位，但該欄位在 ASRS 服務中是感測器/機型描述
 *   （實測 distinct 值為 'DMCIII' 與 null），不是原 Esri 服務裡 pre-event/post-event 的分類，
 *   因此「災前/災後」分類邏輯不再讀這個欄位，改用推導出的事件起始日與影像日期比較（見
 *   getDisasterResponseScenes.ts 的 getFormattedDisasterResponseScenes）。
 */
export const FIELD_NAMES = {
    OBJECTID: 'OBJECTID',
    NAME: 'Name',
    CATEGORY: 'Category',
    GROUP_NAME: 'GroupName',
    PRODUCT_NAME: 'ProductName',
    ZORDER: 'ZOrder',
    EVENT: 'DisasterEvent',
    DATETIME: 'ImageDate',
    CLOUDS_PERCENT: 'CloudCover',
    IMAGE_TYPE: 'ImageType',
    CREATED_DATE: 'CreatedDate',
    SHAPE: 'Shape',
} as const;

export type DisasterResponseImageryServiceFieldName =
    (typeof FIELD_NAMES)[keyof typeof FIELD_NAMES];
