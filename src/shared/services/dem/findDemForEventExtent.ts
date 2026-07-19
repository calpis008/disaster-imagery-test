import { IExtent } from '@esri/arcgis-rest-feature-service';
import { listDemServices } from './listDemServices';
import { getDemServiceInfo } from './getDemServiceInfo';
import {
    extentsIntersect,
    getExtentsOverlapArea,
    projectExtentToWkid,
    toArcGISExtent,
} from './projectExtent';

export type DemMatch = {
    /**
     * DEM service name, e.g. `DEM_260708_tif`
     */
    name: string;
    /**
     * Fully qualified ImageServer REST endpoint for the matched DEM service.
     */
    url: string;
    /**
     * DEM's full extent, in the DEM service's own spatial reference (as returned by its
     * `?f=json` service info) — usable directly as `SceneView.clippingArea`/for camera framing
     * once wrapped in an `Extent` with the same spatial reference wkid as the local scene.
     */
    extent: IExtent;
};

/**
 * Finds which (if any) of the published `DEM_*` services covers a given event extent.
 *
 * Detection logic (see `institution` task brief for the underlying PoC):
 * 1. list all `DEM_*` ImageServer services in the catalog (cached)
 * 2. fetch each DEM's extent (cached per service URL)
 * 3. project the event extent into each DEM's spatial reference and test for bbox overlap
 * 4. of all DEMs that intersect, return the one with the largest overlap area
 *
 * Returns `null` if no DEM intersects the event extent (i.e. the event has no 3D coverage).
 *
 * @param eventExtent the disaster response event's extent, as returned by
 * `getEventExtent` (in the Disaster Response Imagery Service's spatial reference, 3857)
 */
export const findDemForEventExtent = async (
    eventExtent: IExtent
): Promise<DemMatch | null> => {
    if (!eventExtent) {
        return null;
    }

    const services = await listDemServices();

    if (!services.length) {
        return null;
    }

    const eventExtentGeom = toArcGISExtent(eventExtent);

    let best: { match: DemMatch; area: number } | null = null;

    for (const service of services) {
        try {
            const { extent: demExtent } = await getDemServiceInfo(
                service.url
            );

            const demExtentGeom = toArcGISExtent(demExtent);

            const demWkid = demExtentGeom.spatialReference.wkid;

            const projectedEventExtent = await projectExtentToWkid(
                eventExtentGeom,
                demWkid
            );

            if (!projectedEventExtent) {
                continue;
            }

            if (!extentsIntersect(projectedEventExtent, demExtentGeom)) {
                continue;
            }

            const area = getExtentsOverlapArea(
                projectedEventExtent,
                demExtentGeom
            );

            if (area > 0 && (!best || area > best.area)) {
                best = {
                    match: {
                        name: service.name,
                        url: service.url,
                        extent: demExtent,
                    },
                    area,
                };
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
                `Failed to evaluate DEM service ${service.url} for event extent overlap:`,
                error
            );
        }
    }

    return best?.match ?? null;
};
