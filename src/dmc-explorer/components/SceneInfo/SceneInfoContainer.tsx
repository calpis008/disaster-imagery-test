import React, { useMemo } from 'react';
import { useAppSelector } from '@shared/store/configureStore';
import {
    selectAvailableScenes,
    selectQueryParams4SceneInSelectedMode,
    selectAppMode,
} from '@shared/store/ImageryScene/selectors';
import { DATE_FORMAT } from '@shared/constants/UI';
import { formatInUTCTimeZone } from '@shared/utils/date-time/formatInUTCTimeZone';
import { ImageryScene } from '@shared/store/ImageryScene/reducer';

const rowStyle: React.CSSProperties = {
    lineHeight: 1.25,
};

const labelStyle: React.CSSProperties = {
    textAlign: 'right',
    paddingRight: '8px',
    opacity: 0.6,
};

type SceneItemProps = {
    scene: ImageryScene;
    index: number;
    total: number;
};

const SceneItem = ({ scene, index, total }: SceneItemProps) => (
    <div
        style={{
            borderTop:
                index > 0 ? '1px solid rgba(115,178,231,0.15)' : 'none',
            paddingTop: index > 0 ? '8px' : '0',
            marginTop: index > 0 ? '8px' : '0',
        }}
    >
        <div
            className="text-custom-light-blue-50"
            style={{ fontSize: '10px', marginBottom: '4px' }}
        >
            幅 {index + 1}/{total}
        </div>
        <div className="grid grid-cols-2 text-xs">
            <div style={{ ...rowStyle, ...labelStyle }}>場景 ID</div>
            <div
                className="overflow-hidden whitespace-nowrap text-ellipsis"
                style={rowStyle}
                title={scene.sceneId}
            >
                {scene.sceneId || String(scene.objectId)}
            </div>

            <div style={{ ...rowStyle, ...labelStyle }}>影像衛星</div>
            <div style={rowStyle}>{scene.satellite}</div>

            <div style={{ ...rowStyle, ...labelStyle }}>拍攝時間</div>
            <div style={rowStyle}>
                {formatInUTCTimeZone(scene.acquisitionDate, DATE_FORMAT)}
            </div>

            <div style={{ ...rowStyle, ...labelStyle }}>雲量</div>
            <div style={rowStyle}>{Math.round(scene.cloudCover * 100)}%</div>
        </div>
    </div>
);

export const SceneInfoContainer = () => {
    const mode = useAppSelector(selectAppMode);
    const { acquisitionDate } =
        useAppSelector(selectQueryParams4SceneInSelectedMode) || {};
    const availableScenes = useAppSelector(selectAvailableScenes);

    const scenesForDate = useMemo(() => {
        if (!acquisitionDate) return [];
        return availableScenes.filter(
            (s) => s.formattedAcquisitionDate === acquisitionDate
        );
    }, [availableScenes, acquisitionDate]);

    if (mode === 'dynamic' || mode === 'analysis') return null;

    return (
        <div className="analyze-tool-and-scene-info-container" style={{ width: '320px' }}>
            <div className="text-center mb-3 mt-1">
                <h4 className="uppercase text-sm">
                    SCENE INFORMATION
                    {scenesForDate.length > 0 && (
                        <span className="ml-1 text-custom-light-blue-50">
                            ({scenesForDate.length})
                        </span>
                    )}
                </h4>
            </div>

            {scenesForDate.length === 0 ? (
                <div className="text-xs opacity-80 text-center mx-auto max-w-[240px]">
                    <p className="my-3 mx-3">請選擇日期查看影像</p>
                    <p>場景依中心點位置顯示</p>
                </div>
            ) : (
                <div
                    style={{
                        overflowY: 'auto',
                        maxHeight: '240px',
                        paddingRight: '2px',
                    }}
                >
                    {scenesForDate.map((scene, index) => (
                        <SceneItem
                            key={scene.objectId}
                            scene={scene}
                            index={index}
                            total={scenesForDate.length}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
