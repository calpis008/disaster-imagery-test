import { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import ImageElement from '@arcgis/core/layers/support/ImageElement';
import ExtentAndRotationGeoreference from '@arcgis/core/layers/support/ExtentAndRotationGeoreference';
import { AnimationStatus } from '@shared/store/UI/reducer';
import { QueryParams4ImageryScene } from '@shared/store/ImageryScene/reducer';
import { ImageryScene } from '@shared/store/ImageryScene/reducer';
import { getNormalizedExtent } from '@shared/utils/snippets/getNormalizedExtent';
import { exportImage } from '@shared/services/helpers/exportImage';

type Props = {
    imageryServiceUrl: string;
    mapView?: MapView;
    animationStatus: AnimationStatus;
    queryParams4ImageryScenes: QueryParams4ImageryScene[];
    availableScenes: ImageryScene[];
};

const useDMCMediaLayerImageElement = ({
    imageryServiceUrl,
    mapView,
    animationStatus,
    queryParams4ImageryScenes,
    availableScenes,
}: Props) => {
    const [imageElements, setImageElements] = useState<ImageElement[]>(null);
    const abortControllerRef = useRef<AbortController>(null);

    const loadFrameData = async () => {
        if (!mapView) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const extent = getNormalizedExtent(mapView.extent);
            const width = mapView.width;
            const height = mapView.height;
            const { xmin, ymin, xmax, ymax } = extent;

            const requests = queryParams4ImageryScenes
                .filter((qp) => qp.acquisitionDate)
                .map((qp) => {
                    // collect ALL objectIds that match this date at the center point
                    const objectIds = availableScenes
                        .filter(
                            (s) =>
                                s.formattedAcquisitionDate ===
                                qp.acquisitionDate
                        )
                        .map((s) => s.objectId);

                    // fall back to the single selected scene if no matches found
                    const ids =
                        objectIds.length > 0
                            ? objectIds
                            : qp.objectIdOfSelectedScene != null
                            ? [qp.objectIdOfSelectedScene]
                            : null;

                    if (!ids) return Promise.resolve(null as Blob);

                    return exportImage({
                        serviceUrl: imageryServiceUrl,
                        extent,
                        width,
                        height,
                        objectIds: ids,
                        rasterFunctionName: qp.rasterFunctionName,
                        abortController: abortControllerRef.current,
                    });
                });

            const responses = await Promise.all(requests);

            const elements = responses
                .filter((blob): blob is Blob => blob !== null)
                .map(
                    (blob) =>
                        new ImageElement({
                            image: URL.createObjectURL(blob),
                            georeference: new ExtentAndRotationGeoreference({
                                extent: {
                                    spatialReference: { wkid: 102100 },
                                    xmin,
                                    ymin,
                                    xmax,
                                    ymax,
                                },
                            }),
                            opacity: 0,
                        })
                );

            setImageElements(elements);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!animationStatus) {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (imageElements) {
                for (const elem of imageElements) {
                    URL.revokeObjectURL(elem.image as string);
                }
            }
            setImageElements(null);
        } else if (animationStatus === 'loading') {
            loadFrameData();
        }
    }, [animationStatus]);

    useEffect(() => {
        if (animationStatus !== 'loading') return;
        loadFrameData();
    }, [mapView?.height]);

    return imageElements;
};

export default useDMCMediaLayerImageElement;
