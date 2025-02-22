import {useLaunchParams, miniApp, useSignal, initData} from '@telegram-apps/sdk-react';
import {Navigate, Route, Routes, HashRouter} from 'react-router-dom';

import {routes} from '@/navigation/routes.tsx';
import ruRU from "antd-mobile/es/locales/ru-RU";
import {ConfigProvider, ErrorBlock} from "antd-mobile";
import AppHeader from "@/components/AppHeader.tsx";

export function App() {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);
    const initDataState = useSignal(initData.state);

    console.debug(lp)
    console.debug(isDark)

    if (!initDataState || !initDataState.user) {
        return <ErrorBlock status='disconnected' title={"Connection lost"} description={"we're very sorry"}/>
    }

    return (
        <ConfigProvider locale={ruRU}>
            <AppHeader/>
            <HashRouter>
                <Routes>
                    {routes.map((route) => <Route key={route.path} {...route} />)}
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </HashRouter>
        </ConfigProvider>

    );
}
