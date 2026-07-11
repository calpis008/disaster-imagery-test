import MapView from '@arcgis/core/views/MapView';
import React, { FC, useMemo } from 'react';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import ImageryLayerByObjectID from '@shared/components/ImageryLayer/ImageryLayerByObjectID';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import { FS8_SERVICE_URL, FS8_SERVICE_SORT_FIELD, FS8_SERVICE_SORT_VALUE } from '@shared/services/fs8/config';

type Props = {
    mapView?: MapView;
    groupLayer?: GroupLayer;
};

export const FS8Layer: FC<Props> = ({ mapView, groupLayer }: Props) => {
    const defaultMosaicRule = useMemo(() => {
        return new MosaicRule({
            ascending: true,
            method: 'attribute',
            operation: 'first',
            sortField: FS8_SERVICE_SORT_FIELD,
            sortValue: FS8_SERVICE_SORT_VALUE,
        });
    }, []);

    return (
        <ImageryLayerByObjectID
            groupLayer={groupLayer}
            serviceUrl={FS8_SERVICE_URL}
            defaultMosaicRule={defaultMosaicRule}
        />
    );
};
