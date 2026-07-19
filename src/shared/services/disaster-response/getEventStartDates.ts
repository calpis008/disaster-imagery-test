import { DISASTER_RESPONSE_IMAGERY_SERVICE_URL, FIELD_NAMES } from './config';

/**
 * ASRS DMC III 服務沒有 event_start_date 欄位（原 Esri drp_imagery 服務才有）。
 *
 * 推導規則：以該事件所有影像的 min(ImageDate) 作為事件起始日，用
 * outStatistics + groupByFieldsForStatistics 一次查回「全部事件」的 min(ImageDate)，
 * 避免每次切換事件都重新查詢一次統計。查詢結果會被快取在模組內的 Promise，
 * 整個 session 只查一次；若要強制重新整理可呼叫 resetEventStartDatesCache()。
 */

let cachedEventStartDatesPromise: Promise<Map<string, number>> | null = null;

const queryEventStartDatesByEventName = async (): Promise<
    Map<string, number>
> => {
    const outStatistics = JSON.stringify([
        {
            statisticType: 'min',
            onStatisticField: FIELD_NAMES.DATETIME,
            outStatisticFieldName: 'minImageDate',
        },
    ]);

    const params = new URLSearchParams({
        f: 'json',
        where: `(${FIELD_NAMES.EVENT} IS NOT NULL) AND (${FIELD_NAMES.EVENT} <> '')`,
        outStatistics,
        groupByFieldsForStatistics: FIELD_NAMES.EVENT,
        returnGeometry: 'false',
    });

    const response = await fetch(
        `${DISASTER_RESPONSE_IMAGERY_SERVICE_URL}/query?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch event start dates: ${response.statusText}`
        );
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(
            `Error response when fetching event start dates: ${JSON.stringify(data.error)}`
        );
    }

    const eventStartDateByEventName = new Map<string, number>();

    for (const feature of data?.features || []) {
        const { attributes } = feature;
        const eventName = attributes?.[FIELD_NAMES.EVENT];
        const minImageDate = attributes?.minImageDate;

        if (eventName != null && minImageDate != null) {
            eventStartDateByEventName.set(eventName, minImageDate);
        }
    }

    return eventStartDateByEventName;
};

/**
 * Returns a map of `DisasterEvent` value -> derived event start date (min ImageDate, unix timestamp in ms).
 * The underlying query result is cached for the lifetime of the app/session.
 */
export const getEventStartDatesByEventName = (): Promise<
    Map<string, number>
> => {
    if (!cachedEventStartDatesPromise) {
        cachedEventStartDatesPromise = queryEventStartDatesByEventName().catch(
            (err) => {
                // reset the cache on failure so the next call can retry
                cachedEventStartDatesPromise = null;
                throw err;
            }
        );
    }

    return cachedEventStartDatesPromise;
};

/**
 * Returns the derived start date (min ImageDate, unix timestamp in ms) for a single event,
 * or null if the event has no known start date.
 */
export const getEventStartDate = async (
    eventName: string
): Promise<number | null> => {
    if (!eventName) {
        return null;
    }

    const eventStartDateByEventName = await getEventStartDatesByEventName();

    return eventStartDateByEventName.get(eventName) ?? null;
};

/**
 * Clears the cached event start dates so the next call re-queries the service.
 * Exposed mainly for testing.
 */
export const resetEventStartDatesCache = (): void => {
    cachedEventStartDatesPromise = null;
};
