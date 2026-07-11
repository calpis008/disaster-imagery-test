import { useEffect } from 'react';
import { useAppDispatch } from '@shared/store/configureStore';
import { availableImageryScenesUpdated } from '@shared/store/ImageryScene/reducer';
import { imageryServiceTimeExtentUpdated } from '@shared/store/ImageryService/reducer';
import { getTimeExtentOfDMCService } from '@shared/services/dmc/getTimeExtent';
import { getTimeExtentOfFS8Service } from '@shared/services/fs8/getTimeExtent';
import { getTimeExtentOfSentinel2Service } from '@shared/services/sentinel-2/getTimeExtent';
import { useSelectedService } from '../context/SelectedServiceContext';

export const useServiceTimeExtent = (): void => {
    const dispatch = useAppDispatch();
    const { selectedService } = useSelectedService();

    useEffect(() => {
        const load = async () => {
            dispatch(availableImageryScenesUpdated([]));

            let timeExtent;
            if (selectedService === 'dmc') {
                timeExtent = await getTimeExtentOfDMCService();
            } else if (selectedService === 'fs8') {
                timeExtent = await getTimeExtentOfFS8Service();
            } else {
                timeExtent = await getTimeExtentOfSentinel2Service();
            }

            dispatch(imageryServiceTimeExtentUpdated(timeExtent));
        };

        load();
    }, [selectedService]);

    return null;
};
