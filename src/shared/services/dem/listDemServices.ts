import { DEM_CATALOG_URL, DEM_SERVICE_PREFIX } from './config';

export type DemServiceCatalogEntry = {
    /**
     * Service name as it appears in the GeoServer REST catalog (without prefix stripped).
     */
    name: string;
    /**
     * Fully qualified ImageServer REST endpoint for this DEM service.
     */
    url: string;
};

let cachedServicesPromise: Promise<DemServiceCatalogEntry[]> | null = null;

/**
 * Lists all `DEM_*` ImageServer services published at the root of the DEM catalog.
 *
 * The result is cached for the lifetime of the session (module-level promise) since the
 * catalog rarely changes within a single visit and this may be called every time the user
 * selects a different event.
 */
export const listDemServices = async (): Promise<DemServiceCatalogEntry[]> => {
    if (cachedServicesPromise) {
        return cachedServicesPromise;
    }

    cachedServicesPromise = (async () => {
        const response = await fetch(DEM_CATALOG_URL);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch DEM service catalog: ${response.statusText}`
            );
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(
                `Error response when fetching DEM service catalog: ${JSON.stringify(data.error)}`
            );
        }

        const services: Array<{ name: string; type: string }> =
            data.services || [];

        // catalog root URL, without the trailing `?f=json` query string, used to build
        // fully qualified service URLs, e.g. `${catalogRoot}/DEM_260708_tif/ImageServer`
        const catalogRoot = DEM_CATALOG_URL.split('?')[0].replace(/\/$/, '');

        return services
            .filter(
                (service) =>
                    service.type === 'ImageServer' &&
                    service.name?.startsWith(DEM_SERVICE_PREFIX)
            )
            .map((service) => ({
                name: service.name,
                url: `${catalogRoot}/${service.name}/ImageServer`,
            }));
    })().catch((error) => {
        // reset the cache on failure so a subsequent call can retry
        cachedServicesPromise = null;
        throw error;
    });

    return cachedServicesPromise;
};
