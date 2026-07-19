import { DISASTER_RESPONSE_IMAGERY_SERVICE_URL, FIELD_NAMES } from './config';

/**
 * Fetches all OBJECTIDs of rasters belonging to a given disaster response event.
 *
 * Used by the 3D SceneView (`Scene3DView.tsx`) to build a `lockRasterIds` mosaic rule for
 * "whole event" coverage (no specific scene/raster selected) instead of filtering the
 * ImageryLayer via `definitionExpression`/`mosaicRule.where` on the `DisasterEvent` string
 * field. 2026-07-19: filtering by `DisasterEvent` (whether via `definitionExpression` or a
 * `where`-based mosaic rule) was found to make the 3D ImageryLayerView's `exportImage`
 * request hang/abort indefinitely on this ArcGIS Server instance (likely due to the lack of
 * an index on that field combined with the many footprint-intersection sub-queries 3D tile
 * refinement issues) — `lockRasterIds`-based mosaic rules (as already used for single-scene
 * selection) do not hit this problem since the server doesn't need to re-evaluate a where
 * clause per tile.
 */
export const getObjectIdsForEvent = async (
    eventName: string
): Promise<number[]> => {
    if (!eventName) {
        return [];
    }

    const params = new URLSearchParams({
        where: `${FIELD_NAMES.EVENT} = '${eventName.replace(/'/g, "''")}'`,
        outFields: FIELD_NAMES.OBJECTID,
        returnGeometry: 'false',
        f: 'json',
    });

    const response = await fetch(
        `${DISASTER_RESPONSE_IMAGERY_SERVICE_URL}/query?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch object ids for event ${eventName}: ${response.statusText}`
        );
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(
            `Error response when fetching object ids for event ${eventName}: ${JSON.stringify(data.error)}`
        );
    }

    if (!data.features || !Array.isArray(data.features)) {
        return [];
    }

    return data.features.map(
        (feature: { attributes: Record<string, number> }) =>
            feature.attributes[FIELD_NAMES.OBJECTID]
    );
};
