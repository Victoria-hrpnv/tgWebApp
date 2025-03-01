// context/SwaStatusContext.tsx
import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {SwaResponse} from '@/types/swa';
import {useRequest} from "ahooks";

interface SwaStatusContextType {
    userActivityToday: SwaResponse | null;
    user: User | null;
    refresh: () => void;
}

import useSwaApi from "@/hooks/useSwaApi.ts";
import {initData, initDataState, LaunchParams, retrieveLaunchParams, User, useSignal} from "@telegram-apps/sdk-react";
import {ErrorBlock, Mask, SpinLoading} from "antd-mobile";


export const SwaStatusContext = createContext<SwaStatusContextType | undefined>(undefined);

export const SwaStatusProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const {initDataRaw} = retrieveLaunchParams();
    const initDataState = useSignal(initData.state); // Отслеживаем состояние initData
    const [user, setUser] = useState<User | null>(null);
    const {fetchUserActivity, toggleUserActivityStatus} = useSwaApi(initDataRaw);
    const [userActivityToday, setUserActivityToday] = useState<SwaResponse | null>(null);

    const {
        error,
        loading,
        run: refreshData,
    } = useRequest(fetchUserActivity, {
        manual: true, // Запрос выполняется вручную
        onSuccess: (data: SwaResponse) => {
            setUserActivityToday(data)
        }
    });

    useEffect(() => {
        if (initDataState?.user?.id) {
            console.dir(initDataState.user);
            setUser(initDataState.user);
            refresh()
        }
    }, [initDataState]);

    const refresh = () => {
        console.log("refreshing the data")
        if (initDataState?.user?.id) {
            refreshData(initDataState?.user?.id, 0)
        }
    }

    if (error) {
        return <ErrorBlock status='disconnected'/>
    }

    return (
        <SwaStatusContext.Provider value={{user, userActivityToday, refresh}}>
            {children}
        </SwaStatusContext.Provider>
    );
};