/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/store/configureStore';
import { selectSelectedEventName } from '@shared/store/DisasterImageryExplorer/selectors';
import { getEventExtent } from '@shared/services/disaster-response/getEventExtent';
import { findDemForEventExtent } from '@shared/services/dem/findDemForEventExtent';
import {
    demForSelectedEventUpdated,
    isDetectingDemChanged,
} from '@shared/store/Scene3D/reducer';

/**
 * Detects whether the currently selected disaster response event has a matching DEM (3D
 * terrain) service, and keeps `Scene3D.demForSelectedEvent` in sync.
 *
 * Detection logic (see `shared/services/dem/findDemForEventExtent.ts`):
 * 1. query the selected event's extent from the Disaster Response Imagery Service
 * 2. list the published `DEM_*` ImageServer services and fetch each one's extent (cached)
 * 3. project the event extent into each DEM's spatial reference and keep the largest-overlap
 *    match (or `null` if none intersect — meaning this event has no 3D coverage)
 *
 * Should be invoked once near the top of the Disaster Imagery Explorer app (e.g. in
 * `AppLayout`), similar to `useQueryAvailableDisasterResponseScenes`.
 */
export const useDetectDemForSelectedEvent = (): void => {
    const dispatch = useAppDispatch();

    const selectedEvent = useAppSelector(selectSelectedEventName);

    useEffect(() => {
        let isCancelled = false;

        const detect = async () => {
            if (!selectedEvent) {
                dispatch(demForSelectedEventUpdated(null));
                return;
            }

            dispatch(isDetectingDemChanged(true));

            try {
                const eventExtent = await getEventExtent({
                    eventName: selectedEvent,
                });

                const demMatch = await findDemForEventExtent(eventExtent);

                if (!isCancelled) {
                    dispatch(demForSelectedEventUpdated(demMatch));
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(
                    `Failed to detect DEM for selected event "${selectedEvent}":`,
                    error
                );

                if (!isCancelled) {
                    dispatch(demForSelectedEventUpdated(null));
                }
            } finally {
                if (!isCancelled) {
                    dispatch(isDetectingDemChanged(false));
                }
            }
        };

        detect();

        return () => {
            isCancelled = true;
        };
    }, [selectedEvent]);
};

export default useDetectDemForSelectedEvent;
