import { RootState } from '../configureStore';

export const selectIs3DOn = (state: RootState) => state.Scene3D.is3DOn;

export const selectDemForSelectedEvent = (state: RootState) =>
    state.Scene3D.demForSelectedEvent;

export const selectIsDetectingDem = (state: RootState) =>
    state.Scene3D.isDetectingDem;

/**
 * whether the 3D toggle control should be shown/enabled at all — true once DEM detection has
 * completed and a DEM was actually found for the currently selected event.
 */
export const selectIs3DAvailable = (state: RootState) =>
    !!state.Scene3D.demForSelectedEvent;
