import {useLaunchParams, miniApp, useSignal} from '@telegram-apps/sdk-react';
import {Navigate, Route, Routes, HashRouter} from 'react-router-dom';

import {routes} from '@/navigation/routes.tsx';

export function App() {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);

    console.log(lp)
    console.log(isDark)

    return (
        <HashRouter>
            <Routes>
                {routes.map((route) => <Route key={route.path} {...route} />)}
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </HashRouter>
    );
}
