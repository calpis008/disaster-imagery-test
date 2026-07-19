import { IExtent } from '@esri/arcgis-rest-feature-service';
import Extent from '@arcgis/core/geometry/Extent';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import * as projectOperator from '@arcgis/core/geometry/operators/projectOperator';

/**
 * Converts a REST `IExtent` (as returned by ArcGIS Server `/query` or `?f=json`) into an
 * `@arcgis/core` `Extent` instance.
 */
export const toArcGISExtent = (extent: IExtent): Extent => {
    return new Extent({
        xmin: extent.xmin,
        ymin: extent.ymin,
        xmax: extent.xmax,
        ymax: extent.ymax,
        spatialReference: new SpatialReference({
            wkid: extent.spatialReference?.wkid || 102100, // 3857 Web Mercator as fallback, matches Disaster Response Imagery Service's default spatial reference
        }),
    });
};

/**
 * Projects an extent into the given target spatial reference (by wkid), using the JS API's
 * client-side projection engine (`@arcgis/core/geometry/operators/projectOperator`). This
 * supports the TWD97 / TM2 (EPSG:3826) transformation used by the DEM services without a
 * server round-trip.
 *
 * @param extent source extent (any spatial reference recognized by the projection engine)
 * @param targetWkid wkid of the spatial reference to project into
 * @returns the projected extent, or `null` if the projection failed
 */
export const projectExtentToWkid = async (
    extent: Extent,
    targetWkid: number
): Promise<Extent | null> => {
    if (extent.spatialReference?.wkid === targetWkid) {
        return extent;
    }

    if (!projectOperator.isLoaded()) {
        await projectOperator.load();
    }

    const targetSpatialReference = new SpatialReference({ wkid: targetWkid });

    const projected = projectOperator.execute(extent, targetSpatialReference);

    if (!projected || projected.type !== 'extent') {
        return null;
    }

    return projected as Extent;
};

/**
 * Whether two axis-aligned extents (assumed to already be in the same spatial reference)
 * overlap.
 */
export const extentsIntersect = (a: Extent, b: Extent): boolean => {
    return a.xmin < b.xmax && a.xmax > b.xmin && a.ymin < b.ymax && a.ymax > b.ymin;
};

/**
 * Overlap area (in the units of the shared spatial reference) between two axis-aligned
 * extents assumed to already be in the same spatial reference. Returns 0 if they don't
 * overlap.
 *
 * This is a simple bounding-box overlap calculation — accurate enough to answer "do these
 * two rectangles overlap, and by how much" without pulling in the full geometryEngine module.
 */
export const getExtentsOverlapArea = (a: Extent, b: Extent): number => {
    const overlapWidth = Math.min(a.xmax, b.xmax) - Math.max(a.xmin, b.xmin);
    const overlapHeight = Math.min(a.ymax, b.ymax) - Math.max(a.ymin, b.ymin);

    if (overlapWidth <= 0 || overlapHeight <= 0) {
        return 0;
    }

    return overlapWidth * overlapHeight;
};
