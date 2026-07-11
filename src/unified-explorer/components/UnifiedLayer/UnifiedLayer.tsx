import MapView from '@arcgis/core/views/MapView';
import React, { FC, useMemo } from 'react';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import ImageryLayerByObjectID from '@shared/components/ImageryLayer/ImageryLayerByObjectID';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import { useSelectedService } from '../../context/SelectedServiceContext';
import { getServiceConfig } from '../../config/services';

type Props = {
    mapView?: MapView;
    groupLayer?: GroupLayer;
};

export const UnifiedLayer: FC<Props> = ({ mapView, groupLayer }: Props) => {
    const { selectedService } = useSelectedService();
    const svcConfig = getServiceConfig(selectedService);

    const defaultMosaicRule = useMemo(() => {
        return new MosaicRule({
            ascending: true,
            method: 'attribute',
            operation: 'first',
            sortField: svcConfig.sortField,
            sortValue: svcConfig.sortValue,
        });
    }, [svcConfig.sortField, svcConfig.sortValue]);

    return (
        <ImageryLayerByObjectID
            groupLayer={groupLayer}
            serviceUrl={svcConfig.serviceUrl}
            defaultMosaicRule={defaultMosaicRule}
        />
    );
};
