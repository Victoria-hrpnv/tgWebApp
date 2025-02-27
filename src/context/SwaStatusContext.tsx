// context/SwaStatusContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SwaResponse } from '@/types/swa';

interface SwaStatusContextType {
    userActivityData: SwaResponse | null;
    setUserActivityData: (data: SwaResponse | null) => void;
    numberOfDays: number;
    setNumberOfDays: (days: number) => void;
    userDataForOneDay: SwaResponse | null;
    setUserDataForOneDay: (data: SwaResponse | null) => void;
}

export const SwaStatusContext = createContext<SwaStatusContextType | undefined>(undefined);

export const SwaStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userActivityData, setUserActivityData] = useState<SwaResponse | null>(null);
    const [numberOfDays, setNumberOfDays] = useState(1)
    const [userDataForOneDay, setUserDataForOneDay] = useState<SwaResponse | null>(null);

    return (
        <SwaStatusContext.Provider value={{ userActivityData, setUserActivityData, numberOfDays, setNumberOfDays, userDataForOneDay, setUserDataForOneDay }}>
            {children}
        </SwaStatusContext.Provider>
    );
};

// export const useSwaStatus = () => {
//     const context = useContext(SwaStatusContext);
//     if (!context) {
//         throw new Error('useSwaStatus must be used within a SwaStatusProvider');
//     }
//     // if (!context.userActivityData) {
//     //     throw new Error('userActivityData is null');
//     // }
//     return context;
// };
