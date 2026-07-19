import { IExtent } from '@esri/arcgis-rest-feature-service';

export type DemServiceInfo = {
    extent: IExtent;
};

const cache = new Map<string, Promise<DemServiceInfo>>();

/**
 * Fetches the service info (mainly `extent`/`spatialReference`) for a DEM ImageServer.
 * Results are cached by service URL to avoid re-fetching the same DEM's metadata when the
 * user switches between events multiple times in the same session.
 */
export const getDemServiceInfo = async (
    serviceUrl: string
): Promise<DemServiceInfo> => {
    if (cache.has(serviceUrl)) {
        return cache.get(serviceUrl)!;
    }

    const promise = (async () => {
        const params = new URLSearchParams({ f: 'json' });

        const response = await fetch(`${serviceUrl}?${params.toString()}`);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch DEM service info for ${serviceUrl}: ${response.statusText}`
            );
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(
                `Error response when fetching DEM service info for ${serviceUrl}: ${JSON.stringify(data.error)}`
            );
        }

        if (!data.extent) {
            throw new Error(`No extent found for DEM service ${serviceUrl}`);
        }

        return {
            extent: data.extent as IExtent,
        };
    })().catch((error) => {
        cache.delete(serviceUrl);
        throw error;
    });

    cache.set(serviceUrl, promise);

    return promise;
};
