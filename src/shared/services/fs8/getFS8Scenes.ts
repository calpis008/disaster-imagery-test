import { FIELD_NAMES, FS8_SERVICE_URL, FS8Scene } from './config';
import { getFormatedDateString } from '@shared/utils/date-time/formatDateString';
import { DateRange } from '@typing/shared';
import { IFeature } from '@esri/arcgis-rest-feature-service';
import { getFeatureByObjectId } from '../helpers/getFeatureById';
import esriRequest from '@arcgis/core/request';

type GetFS8ScenesParams = {
    mapPoint: number[];
    acquisitionDateRange?: DateRange;
    acquisitionDate?: string;
    abortController: AbortController;
};

const { OBJECTID, NAME, CATEGORY, IMAGE_DATE, CLOUD_COVER, ZORDER } = FIELD_NAMES;

const fs8SceneByObjectId: Map<number, FS8Scene> = new Map();

export const getFormattedFS8Scenes = (features: IFeature[]): FS8Scene[] => {
    return features.map((feature) => {
        const { attributes } = feature;

        const acquisitionDate: number = attributes[IMAGE_DATE];

        const formattedAcquisitionDate = getFormatedDateString({
            date: +acquisitionDate,
        });

        const [acquisitionYear, acquisitionMonth] = formattedAcquisitionDate
            .split('-')
            .map((d) => +d);

        const rawCloudCover = attributes[CLOUD_COVER];
        const cloudCover = rawCloudCover != null ? rawCloudCover / 100 : 0;

        return {
            objectId: attributes[OBJECTID],
            name: attributes[NAME] || String(attributes[OBJECTID]),
            acquisitionDate,
            formattedAcquisitionDate,
            acquisitionYear,
            acquisitionMonth,
            cloudCover,
            formattedCloudCover: Math.ceil(cloudCover * 100),
        };
    });
};

export const getFS8Scenes = async ({
    mapPoint,
    acquisitionDateRange,
    acquisitionDate,
    abortController,
}: GetFS8ScenesParams): Promise<FS8Scene[]> => {
    const whereClauses = ['1=1'];

    if (acquisitionDateRange) {
        whereClauses.push(
            `(${IMAGE_DATE} BETWEEN timestamp '${acquisitionDateRange.startDate} 00:00:00' AND timestamp '${acquisitionDateRange.endDate} 23:59:59')`
        );
    } else if (acquisitionDate) {
        whereClauses.push(
            `(${IMAGE_DATE} BETWEEN timestamp '${acquisitionDate} 00:00:00' AND timestamp '${acquisitionDate} 23:59:59')`
        );
    }

    const [longitude, latitude] = mapPoint;

    const geometry = JSON.stringify({
        spatialReference: { wkid: 4326 },
        x: longitude,
        y: latitude,
    });

    const response = await esriRequest(`${FS8_SERVICE_URL}/query`, {
        query: {
            f: 'json',
            spatialRel: 'esriSpatialRelIntersects',
            geometryType: 'esriGeometryPoint',
            outFields: [OBJECTID, IMAGE_DATE, CLOUD_COVER, NAME, CATEGORY, ZORDER].join(','),
            orderByFields: IMAGE_DATE,
            resultOffset: 0,
            returnGeometry: false,
            resultRecordCount: 1000,
            geometry,
            where: whereClauses.join(' AND '),
        },
        signal: abortController.signal,
        responseType: 'json',
    });

    const data = response.data;

    if (data.error) {
        throw data.error;
    }

    const fs8Scenes = getFormattedFS8Scenes(data?.features || []);

    for (const scene of fs8Scenes) {
        fs8SceneByObjectId.set(scene.objectId, scene);
    }

    return fs8Scenes;
};

export const getFS8SceneByObjectId = async (objectId: number): Promise<FS8Scene> => {
    if (fs8SceneByObjectId.has(objectId)) {
        return fs8SceneByObjectId.get(objectId);
    }

    const feature = await getFeatureByObjectId(FS8_SERVICE_URL, objectId);

    if (!feature) {
        return null;
    }

    const scene = getFormattedFS8Scenes([feature])[0];
    fs8SceneByObjectId.set(objectId, scene);
    return scene;
};
