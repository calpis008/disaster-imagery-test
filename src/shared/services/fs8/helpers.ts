import { ImageryScene } from '@shared/store/ImageryScene/reducer';
import { FS8Scene } from './config';

export const convertFS8SceneToImageryScene = (fs8Scene: FS8Scene): ImageryScene => {
    const {
        objectId,
        name,
        formattedAcquisitionDate,
        acquisitionDate,
        acquisitionYear,
        acquisitionMonth,
        cloudCover,
        formattedCloudCover,
    } = fs8Scene;

    return {
        objectId,
        sceneId: name,
        formattedAcquisitionDate,
        acquisitionDate,
        acquisitionYear,
        acquisitionMonth,
        cloudCover,
        satellite: 'FORMOSAT-8',
        customTooltipText: [`${formattedCloudCover}% 雲量`],
    };
};
