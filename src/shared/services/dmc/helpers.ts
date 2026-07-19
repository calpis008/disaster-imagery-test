import { ImageryScene } from '@shared/store/ImageryScene/reducer';
import { DMCScene } from './config';

export const convertDMCSceneToImageryScene = (
    dmcScene: DMCScene
): ImageryScene => {
    const {
        objectId,
        name,
        formattedAcquisitionDate,
        acquisitionDate,
        acquisitionYear,
        acquisitionMonth,
        cloudCover,
        formattedCloudCover,
    } = dmcScene;

    const imageryScene: ImageryScene = {
        objectId,
        sceneId: name,
        formattedAcquisitionDate,
        acquisitionDate,
        acquisitionYear,
        acquisitionMonth,
        cloudCover,
        satellite: 'DMC III',
        customTooltipText: [`${formattedCloudCover}% 雲量`],
    };

    return imageryScene;
};
