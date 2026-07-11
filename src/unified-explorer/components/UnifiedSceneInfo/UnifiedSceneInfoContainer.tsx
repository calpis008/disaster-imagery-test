import React, { useCallback, useMemo } from 'react';
import { SceneInfoTable, SceneInfoTableData } from '@shared/components/SceneInfoTable';
import { DATE_FORMAT } from '@shared/constants/UI';
import { useAppSelector } from '@shared/store/configureStore';
import { selectAppMode } from '@shared/store/ImageryScene/selectors';
import { formatInUTCTimeZone } from '@shared/utils/date-time/formatInUTCTimeZone';
import { useDataFromSelectedImageryScene } from '@shared/components/SceneInfoTable/useDataFromSelectedScene';
import { useSelectedService } from '../../context/SelectedServiceContext';
import { getDMCSceneByObjectId } from '@shared/services/dmc/getDMCScenes';
import { getFS8SceneByObjectId } from '@shared/services/fs8/getFS8Scenes';
import { getSentinel2SceneByObjectId } from '@shared/services/sentinel-2/getSentinel2Scenes';
import { getServiceConfig } from '../../config/services';

export const UnifiedSceneInfoContainer = () => {
    const mode = useAppSelector(selectAppMode);
    const { selectedService } = useSelectedService();
    const svcConfig = getServiceConfig(selectedService);

    const fetchSceneByObjectId = useCallback(
        async (objectId: number) => {
            if (selectedService === 'dmc') return getDMCSceneByObjectId(objectId);
            if (selectedService === 'fs8') return getFS8SceneByObjectId(objectId);
            return getSentinel2SceneByObjectId(objectId);
        },
        [selectedService]
    );

    const data = useDataFromSelectedImageryScene<any>(fetchSceneByObjectId);

    const tableData: SceneInfoTableData[] = useMemo(() => {
        if (!data) return [];

        const rows: SceneInfoTableData[] = [
            {
                name: '場景 ID',
                value: data.name || String(data.objectId),
                clickToCopy: true,
            },
            {
                name: '影像衛星',
                value: svcConfig.satellite,
            },
            {
                name: '拍攝時間',
                value: formatInUTCTimeZone(data.acquisitionDate, DATE_FORMAT),
            },
        ];

        if (data.cloudCover !== undefined) {
            rows.push({
                name: '雲量',
                value: `${data.formattedCloudCover ?? Math.ceil(data.cloudCover * 100)}%`,
            });
        }

        return rows;
    }, [data, svcConfig]);

    if (mode === 'dynamic' || mode === 'analysis') return null;

    return <SceneInfoTable data={tableData} />;
};
