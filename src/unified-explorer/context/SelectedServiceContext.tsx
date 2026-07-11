import React, { createContext, useContext, useState, useCallback } from 'react';
import { ServiceId } from '../config/services';

const STORAGE_KEY = 'unified_explorer_service';

type SelectedServiceContextValue = {
    selectedService: ServiceId;
    setSelectedService: (id: ServiceId) => void;
};

export const SelectedServiceContext =
    createContext<SelectedServiceContextValue>({
        selectedService: 'dmc',
        setSelectedService: () => {},
    });

export const SelectedServiceProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [selectedService, setSelectedServiceState] = useState<ServiceId>(
        () =>
            (localStorage.getItem(STORAGE_KEY) as ServiceId) || 'dmc'
    );

    const setSelectedService = useCallback((id: ServiceId) => {
        localStorage.setItem(STORAGE_KEY, id);
        setSelectedServiceState(id);
    }, []);

    return (
        <SelectedServiceContext.Provider
            value={{ selectedService, setSelectedService }}
        >
            {children}
        </SelectedServiceContext.Provider>
    );
};

export const useSelectedService = () => useContext(SelectedServiceContext);
