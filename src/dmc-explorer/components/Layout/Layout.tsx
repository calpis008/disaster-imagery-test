import React from 'react';
import BottomPanel from '@shared/components/BottomPanel/BottomPanel';
import { Calendar } from '@shared/components/Calendar';
import { AppHeader } from '@shared/components/AppHeader';
import {
    ContainerOfSecondaryControls,
    ModeSelector,
} from '@shared/components/ModeSelector';
import { useAppSelector } from '@shared/store/configureStore';
import { selectAppMode } from '@shared/store/ImageryScene/selectors';
import { AnimationControl } from '@shared/components/AnimationControl';
import { SwipeLayerSelector } from '@shared/components/SwipeLayerSelector';
import { useSaveAppState2HashParams } from '@shared/hooks/useSaveAppState2HashParams';
import { IS_MOBILE_DEVICE } from '@shared/constants/UI';
import { useShouldShowSecondaryControls } from '@shared/hooks/useShouldShowSecondaryControls';
import { CloudFilter } from '@shared/components/CloudFilter';
import { useQueryAvailableDMCScenes } from '../../hooks/useQueryAvailableDMCScenes';
import { SceneInfoContainer } from '../SceneInfo';

const Layout = () => {
    const mode = useAppSelector(selectAppMode);

    const shouldShowSecondaryControls = useShouldShowSecondaryControls();

    useQueryAvailableDMCScenes();
    useSaveAppState2HashParams();

    if (IS_MOBILE_DEVICE) {
        return (
            <>
                <AppHeader />
                <BottomPanel>
                    <div className="mx-auto" />
                </BottomPanel>
            </>
        );
    }

    return (
        <>
            <AppHeader />
            <BottomPanel>
                <div className="flex flex-shrink-0">
                    <ModeSelector />

                    {shouldShowSecondaryControls && (
                        <ContainerOfSecondaryControls>
                            <SwipeLayerSelector />
                            <AnimationControl />
                        </ContainerOfSecondaryControls>
                    )}
                </div>

                <div className="flex flex-grow justify-center shrink-0">
                    <div className="ml-2 3xl:ml-0">
                        <Calendar>
                            <CloudFilter />
                        </Calendar>
                    </div>

                    <SceneInfoContainer />
                </div>
            </BottomPanel>
        </>
    );
};

export default Layout;
