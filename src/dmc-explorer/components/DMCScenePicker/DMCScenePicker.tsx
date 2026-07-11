import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/store/configureStore';
import { selectAvailableScenes, selectQueryParams4SceneInSelectedMode } from '@shared/store/ImageryScene/selectors';
import { updateObjectIdOfSelectedScene } from '@shared/store/ImageryScene/thunks';

/**
 * When multiple DMC scenes cover the center point on the same date,
 * this component shows a counter (幅 1/3) and prev/next arrows
 * so the user can cycle through all overlapping images.
 */
const DMCScenePicker = () => {
    const dispatch = useAppDispatch();

    const { acquisitionDate, objectIdOfSelectedScene } =
        useAppSelector(selectQueryParams4SceneInSelectedMode) || {};

    const availableScenes = useAppSelector(selectAvailableScenes);

    const scenesForDate = useMemo(() => {
        if (!acquisitionDate) return [];
        return availableScenes.filter(
            (s) => s.formattedAcquisitionDate === acquisitionDate
        );
    }, [availableScenes, acquisitionDate]);

    if (!acquisitionDate || scenesForDate.length <= 1) {
        return null;
    }

    const currentIndex = scenesForDate.findIndex(
        (s) => s.objectId === objectIdOfSelectedScene
    );
    const index = currentIndex === -1 ? 0 : currentIndex;
    const total = scenesForDate.length;

    const goTo = (newIndex: number) => {
        const scene = scenesForDate[newIndex];
        if (scene) {
            dispatch(updateObjectIdOfSelectedScene(scene.objectId));
        }
    };

    const btnStyle: React.CSSProperties = {
        background: 'transparent',
        border: '1px solid rgba(191,238,254,0.5)',
        color: 'rgb(191,238,254)',
        borderRadius: '3px',
        width: '22px',
        height: '22px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        flexShrink: 0,
    };

    return (
        <div
            className="flex items-center gap-1 text-custom-light-blue"
            title={`此日期有 ${total} 幅影像覆蓋中心點，可切換檢視`}
        >
            <button
                style={btnStyle}
                onClick={() => goTo((index - 1 + total) % total)}
            >
                ◄
            </button>
            <span className="text-xs whitespace-nowrap">
                幅 {index + 1}/{total}
            </span>
            <button
                style={btnStyle}
                onClick={() => goTo((index + 1) % total)}
            >
                ►
            </button>
        </div>
    );
};

export default DMCScenePicker;
