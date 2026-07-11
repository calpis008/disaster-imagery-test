const FS8_SERVICE_URL_DEFAULT =
    'https://edi.asrs.gov.tw/geoportal/sharing/servers/65354b2a1ee3498bb0fff27ecd8402ba/rest/services/edi/DIMS_FS_16_4/ImageServer';

export const FS8_SERVICE_URL =
    ENV_FS8_SERVICE_URL || FS8_SERVICE_URL_DEFAULT;

export enum FIELD_NAMES {
    OBJECTID = 'OBJECTID',
    NAME = 'Name',
    CATEGORY = 'Category',
    IMAGE_DATE = 'ImageDate',
    CLOUD_COVER = 'CloudCover',
    ZORDER = 'ZOrder',
}

export const FS8_SERVICE_SORT_FIELD = 'ZOrder';

export const FS8_SERVICE_SORT_VALUE = '0';

export type FS8Scene = {
    objectId: number;
    name: string;
    acquisitionDate: number;
    formattedAcquisitionDate: string;
    acquisitionYear: number;
    acquisitionMonth: number;
    cloudCover: number;
    formattedCloudCover: number;
};
