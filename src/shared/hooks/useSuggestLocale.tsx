import { APP_LANGUAGE, SUGGESTED_LOCALE } from '@shared/constants/UI';
import { useAppDispatch, useAppSelector } from '@shared/store/configureStore';
import { appHeaderDropdownPanelChanged } from '@shared/store/UI/reducer';
import { selectHasDisabledLocaleSuggestion } from '@shared/store/UI/selectors';
import React, { useEffect, useMemo } from 'react';

/**
 * This hook determines whether to suggest a locale switch to the user upon app startup.
 * It checks if the user has disabled locale suggestions and if there is a suggested locale
 * that differs from the current app language. If both conditions are met, it dispatches an action
 * to open the locale switcher panel.
 *
 * @param countOfSupportedLocales - The number of supported locales in the application.
 *
 * @returns {boolean} - Returns true if should suggest locale, false otherwise.
 */
export const useShouldSuggestLocale = (
    countOfSupportedLocales: number
): boolean => {
    const dispatch = useAppDispatch();

    const hasDisableLocaleSuggestion = useAppSelector(
        selectHasDisabledLocaleSuggestion
    );

    /**
     * determine whether it should suggest locale switch.
     * It should suggest locale switch if:
     * 1. the user has not disabled locale suggestion
     * 2. there is a suggested locale
     * 3. the suggested locale is different from the current app language
     * 4. there is more than one supported locale
     */
    const shouldSuggestLocale = useMemo(() => {
        return (
            countOfSupportedLocales > 1 &&
            hasDisableLocaleSuggestion === false &&
            SUGGESTED_LOCALE &&
            SUGGESTED_LOCALE !== APP_LANGUAGE
        );
    }, [hasDisableLocaleSuggestion, countOfSupportedLocales]);

    useEffect(() => {
        // open the locale switcher panel if it should suggest locale switch
        if (shouldSuggestLocale) {
            dispatch(appHeaderDropdownPanelChanged('locale-switcher'));
        }
    }, [shouldSuggestLocale]);

    return shouldSuggestLocale;
};
