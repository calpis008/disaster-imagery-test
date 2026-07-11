import React from 'react';
import MapViewContainer from '@shared/components/MapView/MapViewContainer';
import { AnimationLayer } from '@shared/components/AnimationLayer';
import { GroupLayer } from '@shared/components/GroupLayer';
import { MapPopUpAnchorPoint } from '@shared/components/MapPopUpAnchorPoint';
import { HillshadeLayer } from '@shared/components/HillshadeLayer/HillshadeLayer';
import { MapMagnifier } from '@shared/components/MapMagnifier';
import { MapActionButtonGroup } from '@shared/components/MapActionButton';
import { DMC_SERVICE_URL } from '@shared/services/dmc/config';
import { DMCLayer } from '../DMCLayer';
import { SwipeComponent4ImageryLayers } from '@shared/components/SwipeWidget/SwipeComponent4ImageryLayers';
import { FootPrintOfSelectedScene } from '@shared/components/FootPrintOfSelectedScene';

const Map = () => {
    return (
        <MapViewContainer>
            <FootPrintOfSelectedScene serviceUrl={DMC_SERVICE_URL} />
            <GroupLayer index={1}>
                <DMCLayer />
                <MapPopUpAnchorPoint />
                <AnimationLayer
                    imageryServiceUrl={DMC_SERVICE_URL}
                    authoringAppName="dmc"
                    animationMetadataSources="DMC III 航攝影像"
                />
            </GroupLayer>
            <SwipeComponent4ImageryLayers serviceUrl={DMC_SERVICE_URL} />
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
