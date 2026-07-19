import { APP_NAME, appConfig } from '@shared/config';
import { normalizeLocale } from './helper';

/**
 * Key used to store the user's locale preference in localStorage.
 */
const LOCALE_PREFERENCE_KEY = APP_NAME + '_locale_preference';

/**
 * Key used to store the user's preference for disabling locale suggestions in localStorage.
 */
const LOCALE_SUGGESTION_DISABLED_KEY = APP_NAME + '_locale_suggestion_disabled';

/**
 * Key used to retrieve the locale from URL search parameters.
 */
const LOCALE_SEARCH_PARAM_KEY = 'lang';

/**
 * Retrieves the application language from the URL query parameters or localstorage.
 *
 * This function looks for the "lang" query parameter in the current URL.
 * If the parameter is found, its value is returned in lowercase.
 * If the parameter is not found, 'en' is returned as the default language.
 *
 * @returns {string} The language code from the URL query parameter or 'en' if not found.
 */
export const getAppLanguage = () => {
    // get the "lang" query parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const localeFromSearchParams =
        searchParams.get(LOCALE_SEARCH_PARAM_KEY) || '';

    // get the locale preference from localStorage
    const localeFromLocalStorage =
        localStorage.getItem(LOCALE_PREFERENCE_KEY) || '';

    // get the list of supported locales from appConfig
    const supportedLocales = appConfig.supportedLocales;

    const lang = normalizeLocale(
        localeFromSearchParams || localeFromLocalStorage,
        supportedLocales
    );

    // if the lang query parameter is found and is supported, return it
    if (lang) {
        return lang;
    }

    // if the lang query parameter is not found or not supported, return 'en' as the default language
    return 'en';
};

/**
 * Suggests the most appropriate locale for the application based on user and browser preferences.
 *
 * The function checks for the browser's language setting and normalizes it.
 * If the normalized locale is supported, it is returned. Otherwise, 'en' is returned as the default locale.
 *
 * @returns {string} The suggested locale code (e.g., 'en', 'es', etc.).
 */
export const getSuggestedLocale = () => {
    const supportedLocales = appConfig.supportedLocales;

    // // get the locale preference from localStorage
    // const userPreferredLocale = localStorage.getItem(LOCALE_PREFERENCE_KEY) || '';

    // let lang = normalizeLocale(userPreferredLocale, supportedLocales);

    // if(lang){
    //     return lang;
    // }

    // get the browser's language setting
    const browserLocale = navigator.language || '';

    // normalize and validate the browser locale
    // if it's not supported, an empty string will be returned
    const lang = normalizeLocale(browserLocale, supportedLocales);

    // return the suggested locale or default to 'en'
    return lang || 'en';
};

/**
 * Sets the preferred locale by updating the URL query parameter and localStorage.
 * It also reloads the page to apply the language change.
 * @param lang - The language code to set in the URL.
 * @returns void
 */
export const setPreferredLocale = (lang: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    // Format the lang to lowercase and handle 'en' as default
    const langFormatted = normalizeLocale(lang, appConfig.supportedLocales);

    // update the lang query parameter in the URL and localStorage
    // if lang is empty or 'en', remove the query parameter and localStorage item
    // otherwise, set them to the formatted lang value
    if (!langFormatted || langFormatted === 'en') {
        searchParams.delete(LOCALE_SEARCH_PARAM_KEY);
        localStorage.removeItem(LOCALE_PREFERENCE_KEY);
    } else {
        searchParams.set(LOCALE_SEARCH_PARAM_KEY, langFormatted);
        localStorage.setItem(LOCALE_PREFERENCE_KEY, langFormatted);
    }

    // construct the new URL with updated query parameters
    const newRelativePathQuery =
        window.location.pathname +
        '?' +
        searchParams.toString() +
        window.location.hash;
    window.history.replaceState(null, '', newRelativePathQuery);
    window.location.reload();
};

/**
 * Save the user's preference for disabling locale suggestions in localStorage.
 * @param shouldDisable {boolean} - Whether to disable locale suggestions.
 * @returns void
 */
export const setLocaleSuggestionPreferenceInLocalstorage = (
    shouldDisable: boolean
) => {
    if (shouldDisable) {
        localStorage.setItem(LOCALE_SUGGESTION_DISABLED_KEY, 'true');
    } else {
        localStorage.removeItem(LOCALE_SUGGESTION_DISABLED_KEY);
    }
};

/**
 * Get the user's preference for disabling locale suggestions from localStorage.
 * @returns {boolean} - True if locale suggestions are disabled, false otherwise.
 */
export const getLocaleSuggestionPreferenceFromLocalstorage = (): boolean => {
    const value = localStorage.getItem(LOCALE_SUGGESTION_DISABLED_KEY);
    return value === 'true';
};
