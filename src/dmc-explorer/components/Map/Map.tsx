import React from 'react';
import MapViewContainer from '@shared/components/MapView/MapViewContainer';
import { DMCAnimationLayer } from '../DMCAnimationLayer/DMCAnimationLayer';
import { GroupLayer } from '@shared/components/GroupLayer';
import { MapPopUpAnchorPoint } from '@shared/components/MapPopUpAnchorPoint';
import { HillshadeLayer } from '@shared/components/HillshadeLayer/HillshadeLayer';
import { MapMagnifier } from '@shared/components/MapMagnifier';
import { MapActionButtonGroup } from '@shared/components/MapActionButton';
import { DMC_SERVICE_URL } from '@shared/services/dmc/config';
import { DMCLayer } from '../DMCLayer';
import { DMCSwipeComponent } from '../DMCSwipeComponent/DMCSwipeComponent';
import { FootPrintOfSelectedScene } from '@shared/components/FootPrintOfSelectedScene';

const Map = () => {
    return (
        <MapViewContainer>
            <FootPrintOfSelectedScene serviceUrl={DMC_SERVICE_URL} />
            <GroupLayer index={1}>
                <DMCLayer />
                <MapPopUpAnchorPoint />
                <DMCAnimationLayer />
            </GroupLayer>
            <DMCSwipeComponent />
            <HillshadeLayer />
            <MapActionButtonGroup
                nativeScale={4000}
                serviceName={'DMC III'}
                serviceUrl={DMC_SERVICE_URL}
            />
            <MapMagnifier />
        </MapViewContainer>
    );
};

export default Map;
