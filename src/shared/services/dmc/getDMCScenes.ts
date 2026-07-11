import { FIELD_NAMES, DMC_SERVICE_URL, DMCScene } from './config';
import { getFormatedDateString } from '@shared/utils/date-time/formatDateString';
import { DateRange } from '@typing/shared';
import { IFeature } from '@esri/arcgis-rest-feature-service';
import { getFeatureByObjectId } from '../helpers/getFeatureById';
import esriRequest from '@arcgis/core/request';

type GetDMCScenesParams = {
    mapPoint: number[];
    acquisitionDateRange?: DateRange;
    acquisitionDate?: string;
    abortController: AbortController;
};

const {
    OBJECTID,
    NAME,
    CATEGORY,
    IMAGE_DATE,
    CLOUD_COVER,
    ZORDER,
} = FIELD_NAMES;

const dmcSceneByObjectId: Map<number, DMCScene> = new Map();

export const getFormattedDMCScenes = (features: IFeature[]): DMCScene[] => {
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

        const dmcScene: DMCScene = {
            objectId: attributes[OBJECTID],
            name: attributes[NAME] || String(attributes[OBJECTID]),
            acquisitionDate,
            formattedAcquisitionDate,
            acquisitionYear,
            acquisitionMonth,
            cloudCover,
            formattedCloudCover: Math.ceil(cloudCover * 100),
        };

        return dmcScene;
    });
};

export const getDMCScenes = async ({
    mapPoint,
    acquisitionDateRange,
    acquisitionDate,
    abortController,
}: GetDMCScenesParams): Promise<DMCScene[]> => {
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

    const queryParams = {
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
    };

    const response = await esriRequest(`${DMC_SERVICE_URL}/query`, {
        query: queryParams,
        signal: abortController.signal,
        responseType: 'json',
    });

    const data = response.data;

    if (data.error) {
        throw data.error;
    }

    const dmcScenes: DMCScene[] = getFormattedDMCScenes(data?.features || []);

    for (const scene of dmcScenes) {
        dmcSceneByObjectId.set(scene.objectId, scene);
    }

    return dmcScenes;
};

export const getDMCSceneByObjectId = async (
    objectId: number
): Promise<DMCScene> => {
    if (dmcSceneByObjectId.has(objectId)) {
        return dmcSceneByObjectId.get(objectId);
    }

    const feature = await getFeatureByObjectId(DMC_SERVICE_URL, objectId);

    if (!feature) {
        return null;
    }

    const scene = getFormattedDMCScenes([feature])[0];
    dmcSceneByObjectId.set(objectId, scene);
    return scene;
};
