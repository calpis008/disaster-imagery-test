import React from 'react';
import { useAppDispatch } from '@shared/store/configureStore';
import { modeChanged } from '@shared/store/ImageryScene/reducer';

export const DMCDynamicModeInfo = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="max-w-sm ml-4 2xl:ml-10">
            <div className="text-center mb-3">
                <span className="uppercase text-sm">動態視圖</span>
            </div>

            <p className="text-sm opacity-80">
                在目前地圖顯示中，系統會優先選擇DMC
                III影像庫中最新且雲量最少的場景，並動態融合為一個鑲嵌影像圖層。隨著您的探索，地圖會持續動態擷取並渲染最佳可用場景。
            </p>

            <p className="text-sm opacity-80 mt-2">
                若要選取特定日期的單一場景，請切換至{' '}
                <span
                    className="underline cursor-pointer hover:opacity-100 uppercase"
                    onClick={() => dispatch(modeChanged('find a scene'))}
                >
                    尋找場景
                </span>{' '}
                模式。
            </p>
        </div>
    );
};
