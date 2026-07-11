import { appConfig } from '@shared/config';
import React from 'react';

export type SupportedLocaleData = {
    code: string;
    label: string;
};

const LOCALE_LABEL: {
    [key: string]: string;
} = {
    en: 'English',
    es: 'Español (Spanish)',
    zh: '中文 (Chinese)',
};

export const useSupportedLocales = (): SupportedLocaleData[] => {
    const supportedLocales = React.useMemo(() => {
        const locales = appConfig?.supportedLocales || ['en'];

        return locales.map((locale) => {
            return {
                code: locale,
                label: LOCALE_LABEL[locale] || locale,
            };
        });
    }, []);

    return supportedLocales;
};
