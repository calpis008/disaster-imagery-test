import { downloadBlob } from '@shared/utils/snippets/downloadBlob';

type Params = {
    /** blob URLs of each animation frame (in order) */
    frameUrls: string[];
    /** milliseconds per frame (same as animationSpeed) */
    animationSpeed: number;
    outputWidth: number;
    outputHeight: number;
    authoringAppName: string;
    onStatusChange?: (status: 'encoding' | 'done' | 'failed') => void;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

export const createAnimationVideo = async ({
    frameUrls,
    animationSpeed,
    outputWidth,
    outputHeight,
    authoringAppName,
    onStatusChange,
}: Params): Promise<void> => {
    onStatusChange?.('encoding');

    try {
        const images = await Promise.all(frameUrls.map(loadImage));

        let w = outputWidth % 2 === 0 ? outputWidth : outputWidth - 1;
        let h = outputHeight % 2 === 0 ? outputHeight : outputHeight - 1;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        // Prefer MP4 (Chrome 121+), fall back to WebM
        const mimeType = MediaRecorder.isTypeSupported('video/mp4')
            ? 'video/mp4'
            : 'video/webm';
        const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';

        const fps = Math.round(1000 / animationSpeed);
        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, { mimeType });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        await new Promise<void>((resolve, reject) => {
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                downloadBlob(
                    blob,
                    `${authoringAppName}-animation.${ext}`
                );
                resolve();
            };
            recorder.onerror = reject;

            recorder.start();

            let i = 0;
            const renderNext = () => {
                if (i >= images.length) {
                    // Hold last frame one extra interval so MediaRecorder captures it
                    setTimeout(() => recorder.stop(), animationSpeed);
                    return;
                }
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(images[i], 0, 0, w, h);
                i++;
                setTimeout(renderNext, animationSpeed);
            };

            renderNext();
        });

        onStatusChange?.('done');
    } catch (err) {
        console.error('createAnimationVideo failed:', err);
        onStatusChange?.('failed');
    }
};
