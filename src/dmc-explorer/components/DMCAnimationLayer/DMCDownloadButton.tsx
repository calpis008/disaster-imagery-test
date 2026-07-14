import React, { FC, useState } from 'react';
import ImageElement from '@arcgis/core/layers/support/ImageElement';
import { createAnimationVideo } from '../../utils/createAnimationVideo';

type Status = 'idle' | 'encoding' | 'done' | 'failed';

const VIDEO_SIZES = [
    [1920, 1080],
    [1080, 720],
    [1080, 1080],
] as const;

type Props = {
    mediaLayerElements: ImageElement[];
    animationSpeed: number;
    mapWidth: number;
    mapHeight: number;
};

export const DMCDownloadButton: FC<Props> = ({
    mediaLayerElements,
    animationSpeed,
    mapWidth,
    mapHeight,
}) => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<Status>('idle');

    const download = async (w: number, h: number) => {
        setOpen(false);
        setStatus('encoding');

        const frameUrls = mediaLayerElements.map((el) => el.image as string);

        await createAnimationVideo({
            frameUrls,
            animationSpeed,
            outputWidth: w,
            outputHeight: h,
            authoringAppName: 'dmc',
            onStatusChange: (s) =>
                setStatus(s === 'encoding' ? 'encoding' : s === 'done' ? 'done' : 'failed'),
        });
    };

    if (status === 'encoding') {
        return (
            <div className="flex items-center text-xs opacity-80 px-2">
                <calcite-loader scale="s" label="loading" />
                <span className="ml-1">產生影片中…</span>
            </div>
        );
    }

    if (status === 'done' || status === 'failed') {
        return (
            <div className="flex items-center text-xs px-2">
                <span className={status === 'done' ? 'opacity-80' : 'text-red-400'}>
                    {status === 'done' ? '下載完成' : '下載失敗'}
                </span>
                <span
                    className="ml-2 opacity-60 hover:opacity-100 cursor-pointer"
                    onClick={() => setStatus('idle')}
                >
                    ✕
                </span>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Download icon button */}
            <div
                className="opacity-70 hover:opacity-100 cursor-pointer flex items-center justify-center"
                style={{ width: 64, height: 64 }}
                onClick={() => setOpen((v) => !v)}
                title="下載 MP4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height={28}
                    width={28}
                    fill="currentColor"
                >
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" />
                </svg>
            </div>

            {/* Size picker dropdown */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-1 w-36 theme-background border border-custom-light-blue-50 rounded text-xs"
                    style={{ zIndex: 50 }}
                >
                    <div className="px-3 py-2 text-custom-light-blue-50 uppercase text-center border-b border-custom-light-blue-50">
                        選擇解析度
                    </div>
                    {VIDEO_SIZES.map(([w, h]) => (
                        <div
                            key={`${w}x${h}`}
                            className="px-3 py-2 cursor-pointer hover:opacity-100 opacity-70 text-center"
                            onClick={() => download(w, h)}
                        >
                            {w} × {h}
                        </div>
                    ))}
                    <div
                        className="px-3 py-2 cursor-pointer hover:opacity-100 opacity-70 text-center border-t border-custom-light-blue-50"
                        onClick={() => download(mapWidth, mapHeight)}
                    >
                        目前視窗大小
                    </div>
                </div>
            )}
        </div>
    );
};
