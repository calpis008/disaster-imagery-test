import React, { FC } from 'react';
import { APP_NAME } from '@shared/config';
import { useDataOfImageryExplorerApps } from '@shared/hooks/useDataOfImageryExplorerApps';
import logoUrl from '../../../../logo.png';

const LIVING_ATLAS_SENTINEL2_URL =
    'https://livingatlas.arcgis.com/sentinel2explorer/';

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
            className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4"
            style={{
                height: '60px',
                background: '#0f1e28',
                borderBottom: '2px solid #1e3a4e',
                fontFamily:
                    '"Microsoft JhengHei","Noto Sans TC","Avenir Next",sans-serif',
            }}
        >
            <div
                className="flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden"
                style={{
                    width: '42px',
                    height: '42px',
                    border: '2px solid #ffffff',
                }}
            >
                <img
                    src={logoUrl}
                    alt="航測及遙測分署"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0) invert(1)',
                    }}
                />
            </div>

            <div className="flex-grow min-w-0">
                <div
                    style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    農業部林業及自然保育署 航測及遙測分署
                </div>
                <div
                    style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: '1px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Aerial Survey and Remote Sensing Branch, Forestry and
                    Nature Conservation Agency, MOA
                </div>
            </div>

            <nav className="flex gap-1 flex-shrink-0">
                {apps.map((app) => {
                    const isActive = app.appName === APP_NAME;
                    const isSentinel =
                        app.url === LIVING_ATLAS_SENTINEL2_URL ||
                        app.appName === 'sentinel2explorer';
                    return (
                        <button
                            key={app.appName}
                            onClick={() => navigate(app.url)}
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
                            {isSentinel && !isActive ? ' ↗' : ''}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default AgencyHeader;
