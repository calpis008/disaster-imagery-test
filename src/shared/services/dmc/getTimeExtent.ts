import { ImageryServiceTimeExtentData } from '@typing/imagery-service';
import { DMC_SERVICE_URL } from './config';
import esriRequest from '@arcgis/core/request';

let timeExtentData: ImageryServiceTimeExtentData = null;

export const getTimeExtentOfDMCService =
    async (): Promise<ImageryServiceTimeExtentData> => {
        if (timeExtentData) {
            return timeExtentData;
        }

        try {
            const response = await esriRequest(DMC_SERVICE_URL, {
                query: { f: 'json' },
                responseType: 'json',
            });

            const data = response.data;
            const [start, end] = data?.timeInfo?.timeExtent || [];

            timeExtentData = { start, end };
        } catch (err) {
            console.error('Failed to fetch DMC service time extent:', err);
            timeExtentData = { start: undefined, end: undefined };
        }

        return timeExtentData;
    };
