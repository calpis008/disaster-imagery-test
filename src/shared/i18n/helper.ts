/**
 * Formats and validates a locale code against a list of supported locales.
 *
 * - If the input `locale` is falsy, returns an empty string.
 * - If the locale contains an underscore (e.g., 'en_US'), only the part before the underscore is used (e.g., 'en').
 * - The locale code is converted to lowercase.
 * - If `supportedLocales` is provided and does not include the formatted locale, returns an empty string.
 * - Otherwise, returns the formatted locale code.
 *
 * @param locale - The locale code to format (e.g., 'en_US', 'fr').
 * @param supportedLocales - An array of supported locale codes (in lowercase, e.g., ['en', 'fr']).
 * @returns The formatted locale code if valid and supported, otherwise an empty string.
 */
export const normalizeLocale = (
    locale: string,
    supportedLocales: string[]
): string => {
    if (!locale) {
        return '';
    }

    locale = locale.split('-')[0]; // handle cases like 'en-US' by taking only 'en'
    locale = locale.toLowerCase();

    if (supportedLocales && !supportedLocales.includes(locale)) {
        return '';
    }

    return locale;
};
