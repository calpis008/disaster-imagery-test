import React from 'react';
import MapViewContainer from '@shared/components/MapView/MapViewContainer';
import { AnimationLayer } from '@shared/components/AnimationLayer';
import { GroupLayer } from '@shared/components/GroupLayer';
import { MapPopUpAnchorPoint } from '@shared/components/MapPopUpAnchorPoint';
import { HillshadeLayer } from '@shared/components/HillshadeLayer/HillshadeLayer';
import { MapMagnifier } from '@shared/components/MapMagnifier';
import { MapActionButtonGroup } from '@shared/components/MapActionButton';
import { SwipeComponent4ImageryLayers } from '@shared/components/SwipeWidget/SwipeComponent4ImageryLayers';
import { FootPrintOfSelectedScene } from '@shared/components/FootPrintOfSelectedScene';
import { UnifiedLayer } from '../UnifiedLayer';
import { useSelectedService } from '../../context/SelectedServiceContext';
import { getServiceConfig } from '../../config/services';

const Map = () => {
    const { selectedService } = useSelectedService();
    const svcConfig = getServiceConfig(selectedService);

    return (
        <MapViewContainer>
            <FootPrintOfSelectedScene serviceUrl={svcConfig.serviceUrl} />
            <GroupLayer index={1}>
                <UnifiedLayer />
                <MapPopUpAnchorPoint />
                <AnimationLayer
                    imageryServiceUrl={svcConfig.serviceUrl}
                    authoringAppName={selectedService}
                    animationMetadataSources={svcConfig.label}
                />
            </GroupLayer>
            <SwipeComponent4ImageryLayers serviceUrl={svcConfig.serviceUrl} />
            <HillshadeLayer />
            <MapActionButtonGroup
                nativeScale={selectedService === 'sentinel2' ? 37795 : 4000}
                serviceName={svcConfig.satellite}
                serviceUrl={svcConfig.serviceUrl}
            />
            <MapMagnifier />
        </MapViewContainer>
    );
};

export default Map;
