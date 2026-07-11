import React from 'react';
import MapViewContainer from '@shared/components/MapView/MapViewContainer';
import { AnimationLayer } from '@shared/components/AnimationLayer';
import { GroupLayer } from '@shared/components/GroupLayer';
import { MapPopUpAnchorPoint } from '@shared/components/MapPopUpAnchorPoint';
import { HillshadeLayer } from '@shared/components/HillshadeLayer/HillshadeLayer';
import { MapMagnifier } from '@shared/components/MapMagnifier';
import { MapActionButtonGroup } from '@shared/components/MapActionButton';
import { FS8_SERVICE_URL } from '@shared/services/fs8/config';
import { FS8Layer } from '../FS8Layer';
import { SwipeComponent4ImageryLayers } from '@shared/components/SwipeWidget/SwipeComponent4ImageryLayers';
import { FootPrintOfSelectedScene } from '@shared/components/FootPrintOfSelectedScene';

const Map = () => {
    return (
        <MapViewContainer>
            <FootPrintOfSelectedScene serviceUrl={FS8_SERVICE_URL} />
            <GroupLayer index={1}>
                <FS8Layer />
                <MapPopUpAnchorPoint />
                <AnimationLayer
                    imageryServiceUrl={FS8_SERVICE_URL}
                    authoringAppName="fs8"
                    animationMetadataSources="福衛八號影像"
                />
            </GroupLayer>
            <SwipeComponent4ImageryLayers serviceUrl={FS8_SERVICE_URL} />
            <HillshadeLayer />
            <MapActionButtonGroup
                nativeScale={2000}
                serviceName={'FORMOSAT-8'}
                serviceUrl={FS8_SERVICE_URL}
            />
            <MapMagnifier />
        </MapViewContainer>
    );
};

export default Map;
