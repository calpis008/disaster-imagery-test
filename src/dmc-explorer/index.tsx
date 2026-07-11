import '@shared/styles/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { ErrorPage } from '@shared/components/ErrorPage';
import { getDMCExplorerStore } from './store';
import Map from './components/Map/Map';
import Layout from './components/Layout/Layout';
import { initializeApp } from '@shared/utils/initialize-app/initializeApp';
import '@shared/components/calcite-components';

const DMC_EXPLORER_APP_ID = ENV_DMC_EXPLORER_APP_ID || '';

(async () => {
    const root = createRoot(document.getElementById('root'));

    try {
        await initializeApp({
            appId: DMC_EXPLORER_APP_ID,
        });

        const store = await getDMCExplorerStore();

        root.render(
            <ReduxProvider store={store}>
                <ErrorBoundary>
                    <Map />
                    <Layout />
                </ErrorBoundary>
            </ReduxProvider>
        );
    } catch (err) {
        console.log(err);
        root.render(<ErrorPage error={err} />);
    }
})();
