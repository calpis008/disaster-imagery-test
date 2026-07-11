import React, { useCallback, useMemo } from 'react';
import { SceneInfoTable, SceneInfoTableData } from '@shared/components/SceneInfoTable';
import { DATE_FORMAT } from '@shared/constants/UI';
import { useAppSelector } from '@shared/store/configureStore';
import { selectAppMode } from '@shared/store/ImageryScene/selectors';
import { formatInUTCTimeZone } from '@shared/utils/date-time/formatInUTCTimeZone';
import { getFS8SceneByObjectId } from '@shared/services/fs8/getFS8Scenes';
import { useDataFromSelectedImageryScene } from '@shared/components/SceneInfoTable/useDataFromSelectedScene';
import { FS8Scene } from '@shared/services/fs8/config';

export const SceneInfoContainer = () => {
    const mode = useAppSelector(selectAppMode);

    const fetchSceneByObjectId = useCallback(async (objectId: number) => {
        return await getFS8SceneByObjectId(objectId);
    }, []);

    const data = useDataFromSelectedImageryScene<FS8Scene>(fetchSceneByObjectId);

    const tableData: SceneInfoTableData[] = useMemo(() => {
        if (!data) return [];

        return [
            {
                name: '場景 ID',
                value: data.name,
                clickToCopy: true,
            },
            {
                name: '影像衛星',
                value: 'FORMOSAT-8',
            },
            {
                name: '拍攝時間',
                value: formatInUTCTimeZone(data.acquisitionDate, DATE_FORMAT),
            },
            {
                name: '雲量',
                value: `${data.formattedCloudCover}%`,
            },
        ];
    }, [data]);

    if (mode === 'dynamic' || mode === 'analysis') {
        return null;
    }

    return <SceneInfoTable data={tableData} />;
};
