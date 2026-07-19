import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IExtent } from '@esri/arcgis-rest-feature-service';

export type DemForEvent = {
    name: string;
    url: string;
    extent: IExtent;
};

export type Scene3DState = {
    /**
     * whether the 3D (SceneView) mode is currently on. Only meaningful/toggleable when
     * `demForSelectedEvent` is not null (i.e. a DEM was found for the currently selected event).
     */
    is3DOn: boolean;
    /**
     * the DEM service (if any) that intersects the currently selected event's extent, as
     * detected by `findDemForEventExtent`. `null` means either no event is selected, detection
     * hasn't completed yet, or no DEM covers the selected event (no 3D available).
     */
    demForSelectedEvent: DemForEvent | null;
    /**
     * true while the DEM auto-detection request is in flight for the currently selected event.
     */
    isDetectingDem: boolean;
};

export const initialScene3DState: Scene3DState = {
    is3DOn: false,
    demForSelectedEvent: null,
    isDetectingDem: false,
};

const slice = createSlice({
    name: 'Scene3D',
    initialState: initialScene3DState,
    reducers: {
        is3DOnToggled: (state) => {
            // can only turn 3D on if a DEM has been found for the currently selected event
            if (!state.is3DOn && !state.demForSelectedEvent) {
                return;
            }

            state.is3DOn = !state.is3DOn;
        },
        is3DOnChanged: (state, action: PayloadAction<boolean>) => {
            state.is3DOn = action.payload;
        },
        demForSelectedEventUpdated: (
            state,
            action: PayloadAction<DemForEvent | null>
        ) => {
            state.demForSelectedEvent = action.payload;

            // if the newly selected event has no DEM coverage, force exit out of 3D mode
            if (!action.payload) {
                state.is3DOn = false;
            }
        },
        isDetectingDemChanged: (state, action: PayloadAction<boolean>) => {
            state.isDetectingDem = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    is3DOnToggled,
    is3DOnChanged,
    demForSelectedEventUpdated,
    isDetectingDemChanged,
} = slice.actions;

export default reducer;
