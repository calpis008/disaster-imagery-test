import React, { FC } from 'react';
import { APP_NAME } from '@shared/config';
import { useDataOfImageryExplorerApps } from '@shared/hooks/useDataOfImageryExplorerApps';
import logoUrl from '../../../../public/logo.png';

const AgencyHeader: FC = () => {
    const apps = useDataOfImageryExplorerApps();

    const navigate = (url: string) => {
        if (url.startsWith('http') && !url.includes('localhost')) {
            window.open(url, '_blank');
        } else if (url.startsWith('http')) {
            window.location.href = url;
        } else {
            const basePath = window.location.pathname.replace(
                /\/[^/]*\/?$/,
                '/'
            );
            const appPath = url.replace(/^\//, '');
            window.location.href = basePath + appPath + '/';
        }
    };

    return (
        <div
            className="absolute top-0 left-0 right-0 z-30 flex items-center px-4"
            style={{
                height: '60px',
                background: '#0f1e28',
                borderBottom: '2px solid #1e3a4e',
                fontFamily:
                    '"Microsoft JhengHei","Noto Sans TC","Avenir Next",sans-serif',
                flexShrink: 0,
            }}
        >
            <img
                src={logoUrl}
                alt="農業部林業及自然保育署 航測及遙測分署"
                style={{ height: '42px', flexShrink: 0 }}
            />
            <div className="flex-grow" />

            <nav style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {apps.map((app) => {
                    const isActive = app.appName === APP_NAME;
                    return (
                        <button
                            key={app.appName}
                            onClick={() => {
                                if (!isActive) navigate(app.url);
                            }}
                            style={{
                                padding: '6px 14px',
                                color: '#ffffff',
                                background: isActive
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'transparent',
                                fontWeight: isActive ? 'bold' : 'normal',
                                fontSize: '13px',
                                borderRadius: '3px',
                                cursor: isActive ? 'default' : 'pointer',
                                border: 'none',
                                whiteSpace: 'nowrap',
                            }}
                            title={app.tooltip}
                        >
                            {app.title}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default AgencyHeader;
