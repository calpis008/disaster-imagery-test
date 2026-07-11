import { ImageryServiceTimeExtentData } from '@typing/imagery-service';
import { FS8_SERVICE_URL } from './config';
import esriRequest from '@arcgis/core/request';

let timeExtentData: ImageryServiceTimeExtentData = null;

export const getTimeExtentOfFS8Service =
    async (): Promise<ImageryServiceTimeExtentData> => {
        if (timeExtentData) {
            return timeExtentData;
        }

        try {
            const response = await esriRequest(FS8_SERVICE_URL, {
                query: { f: 'json' },
                responseType: 'json',
            });

            const data = response.data;
            const [start, end] = data?.timeInfo?.timeExtent || [];

            timeExtentData = { start, end };
        } catch (err) {
            console.error('Failed to fetch FS-8 service time extent:', err);
            timeExtentData = { start: undefined, end: undefined };
        }

        return timeExtentData;
    };
