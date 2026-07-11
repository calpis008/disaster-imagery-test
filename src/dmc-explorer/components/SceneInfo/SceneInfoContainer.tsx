import React, { useCallback, useMemo } from 'react';
import { SceneInfoTable, SceneInfoTableData } from '@shared/components/SceneInfoTable';
import { DATE_FORMAT } from '@shared/constants/UI';
import { useAppSelector } from '@shared/store/configureStore';
import { selectAppMode } from '@shared/store/ImageryScene/selectors';
import { formatInUTCTimeZone } from '@shared/utils/date-time/formatInUTCTimeZone';
import { getDMCSceneByObjectId } from '@shared/services/dmc/getDMCScenes';
import { useDataFromSelectedImageryScene } from '@shared/components/SceneInfoTable/useDataFromSelectedScene';
import { DMCScene } from '@shared/services/dmc/config';

export const SceneInfoContainer = () => {
    const mode = useAppSelector(selectAppMode);

    const fetchSceneByObjectId = useCallback(async (objectId: number) => {
        const res = await getDMCSceneByObjectId(objectId);
        return res;
    }, []);

    const data = useDataFromSelectedImageryScene<DMCScene>(fetchSceneByObjectId);

    const tableData: SceneInfoTableData[] = useMemo(() => {
        if (!data) {
            return [];
        }

        const { acquisitionDate, formattedCloudCover, name } = data;

        return [
            {
                name: '場景 ID',
                value: name,
                clickToCopy: true,
            },
            {
                name: '影像衛星',
                value: 'DMC III',
            },
            {
                name: '拍攝時間',
                value: formatInUTCTimeZone(acquisitionDate, DATE_FORMAT),
            },
            {
                name: '雲量',
                value: `${formattedCloudCover}%`,
            },
        ];
    }, [data]);

    if (mode === 'dynamic' || mode === 'analysis') {
        return null;
    }

    return <SceneInfoTable data={tableData} />;
};
