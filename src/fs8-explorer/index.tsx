import '@shared/styles/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { ErrorPage } from '@shared/components/ErrorPage';
import { getFS8ExplorerStore } from './store';
import Map from './components/Map/Map';
import Layout from './components/Layout/Layout';
import { initializeApp } from '@shared/utils/initialize-app/initializeApp';
import '@shared/components/calcite-components';

const FS8_EXPLORER_APP_ID = ENV_FS8_EXPLORER_APP_ID || '';

(async () => {
    const root = createRoot(document.getElementById('root'));

    try {
        await initializeApp({
            appId: FS8_EXPLORER_APP_ID,
        });

        const store = await getFS8ExplorerStore();

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
