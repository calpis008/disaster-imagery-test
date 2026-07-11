import MapView from '@arcgis/core/views/MapView';
import React, { FC, useMemo } from 'react';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import ImageryLayerByObjectID from '@shared/components/ImageryLayer/ImageryLayerByObjectID';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import { DMC_SERVICE_URL, DMC_SERVICE_SORT_FIELD, DMC_SERVICE_SORT_VALUE } from '@shared/services/dmc/config';

type Props = {
    mapView?: MapView;
    groupLayer?: GroupLayer;
};

export const DMCLayer: FC<Props> = ({ mapView, groupLayer }: Props) => {
    const defaultMosaicRule = useMemo(() => {
        return new MosaicRule({
            ascending: true,
            method: 'attribute',
            operation: 'first',
            sortField: DMC_SERVICE_SORT_FIELD,
            sortValue: DMC_SERVICE_SORT_VALUE,
        });
    }, []);

    return (
        <ImageryLayerByObjectID
            groupLayer={groupLayer}
            serviceUrl={DMC_SERVICE_URL}
            defaultMosaicRule={defaultMosaicRule}
        />
    );
};
