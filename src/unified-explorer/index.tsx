import '@shared/styles/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { ErrorPage } from '@shared/components/ErrorPage';
import { getUnifiedExplorerStore } from './store';
import Map from './components/Map/Map';
import Layout from './components/Layout/Layout';
import { initializeApp } from '@shared/utils/initialize-app/initializeApp';
import { SelectedServiceProvider } from './context/SelectedServiceContext';
import '@shared/components/calcite-components';

const UNIFIED_EXPLORER_APP_ID = ENV_DMC_EXPLORER_APP_ID || '';

(async () => {
    const root = createRoot(document.getElementById('root'));

    try {
        await initializeApp({
            appId: UNIFIED_EXPLORER_APP_ID,
        });

        const store = await getUnifiedExplorerStore();

        root.render(
            <ReduxProvider store={store}>
                <SelectedServiceProvider>
                    <ErrorBoundary>
                        <Map />
                        <Layout />
                    </ErrorBoundary>
                </SelectedServiceProvider>
            </ReduxProvider>
        );
    } catch (err) {
        console.log(err);
        root.render(<ErrorPage error={err} />);
    }
})();
