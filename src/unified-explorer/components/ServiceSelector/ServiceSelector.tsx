import React from 'react';
import classNames from 'classnames';
import { SERVICES, ServiceId } from '../../config/services';
import { useSelectedService } from '../../context/SelectedServiceContext';

export const ServiceSelector: React.FC = () => {
    const { selectedService, setSelectedService } = useSelectedService();

    return (
        <div className="flex items-center gap-1 px-2">
            {SERVICES.map((svc) => (
                <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className={classNames(
                        'px-3 py-1 text-xs border rounded transition-colors whitespace-nowrap',
                        selectedService === svc.id
                            ? 'bg-custom-light-blue text-black border-custom-light-blue'
                            : 'text-custom-light-blue border-custom-light-blue-50 hover:border-custom-light-blue'
                    )}
                >
                    {svc.label}
                </button>
            ))}
        </div>
    );
};
