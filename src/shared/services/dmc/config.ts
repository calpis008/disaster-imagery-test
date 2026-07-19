const DMC_SERVICE_URL_DEFAULT =
    'https://edi.asrs.gov.tw/geoportal/sharing/servers/473e7b17fd4b4a3ebf37d27ad6afc9b9/rest/services/edi/DIMS_DMCIII_8_3/ImageServer';

export const DMC_SERVICE_URL =
    ENV_DMC_SERVICE_URL || DMC_SERVICE_URL_DEFAULT;

export enum FIELD_NAMES {
    OBJECTID = 'OBJECTID',
    NAME = 'Name',
    CATEGORY = 'Category',
    IMAGE_DATE = 'ImageDate',
    CLOUD_COVER = 'CloudCover',
    ZORDER = 'ZOrder',
    IMAGE_ORDER = 'ImageOrder',
}

export const DMC_SERVICE_SORT_FIELD = 'ZOrder';

export const DMC_SERVICE_SORT_VALUE = '0';

export type DMCScene = {
    objectId: number;
    name: string;
    acquisitionDate: number;
    formattedAcquisitionDate: string;
    acquisitionYear: number;
    acquisitionMonth: number;
    cloudCover: number;
    formattedCloudCover: number;
};
