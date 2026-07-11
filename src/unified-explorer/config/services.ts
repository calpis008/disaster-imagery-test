import { DMC_SERVICE_URL, DMC_SERVICE_SORT_FIELD, DMC_SERVICE_SORT_VALUE } from '@shared/services/dmc/config';
import { FS8_SERVICE_URL, FS8_SERVICE_SORT_FIELD, FS8_SERVICE_SORT_VALUE } from '@shared/services/fs8/config';
import { SENTINEL_2_SERVICE_URL, SENTINEL2_SERVICE_SORT_FIELD, SENTINEL2_SERVICE_SORT_VALUE } from '@shared/services/sentinel-2/config';

export type ServiceId = 'dmc' | 'fs8' | 'sentinel2';

export type ServiceConfig = {
    id: ServiceId;
    label: string;
    serviceUrl: string;
    sortField: string;
    sortValue: string;
    supportsRasterFunctions: boolean;
    satellite: string;
};

export const SERVICES: ServiceConfig[] = [
    {
        id: 'dmc',
        label: 'DMC III 航攝',
        serviceUrl: DMC_SERVICE_URL,
        sortField: DMC_SERVICE_SORT_FIELD,
        sortValue: DMC_SERVICE_SORT_VALUE,
        supportsRasterFunctions: false,
        satellite: 'DMC III',
    },
    {
        id: 'fs8',
        label: '福衛八號',
        serviceUrl: FS8_SERVICE_URL,
        sortField: FS8_SERVICE_SORT_FIELD,
        sortValue: FS8_SERVICE_SORT_VALUE,
        supportsRasterFunctions: false,
        satellite: 'FORMOSAT-8',
    },
    {
        id: 'sentinel2',
        label: 'Sentinel-2',
        serviceUrl: SENTINEL_2_SERVICE_URL,
        sortField: SENTINEL2_SERVICE_SORT_FIELD,
        sortValue: SENTINEL2_SERVICE_SORT_VALUE,
        supportsRasterFunctions: true,
        satellite: 'Sentinel-2',
    },
];

export const getServiceConfig = (id: ServiceId): ServiceConfig =>
    SERVICES.find((s) => s.id === id);
