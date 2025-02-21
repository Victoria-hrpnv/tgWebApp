import {Page} from "antd-mobile/es/components/calendar/convert";
import {FC, useEffect} from "react";
import AppHeader from "@/components/AppHeader.tsx";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {initData, initDataState, retrieveLaunchParams, useSignal} from "@telegram-apps/sdk-react";
import {ErrorBlock} from "antd-mobile";
import {SwaKey} from "@/types/swa.ts";

const SWAPage: FC = () => {
    const {initDataRaw} = retrieveLaunchParams();

    const initDataState = useSignal(initData.state);
    const {get, toggleStatus} = useSwaApi(initDataRaw);

    const handleToggleStatus = (key: SwaKey) => {
        toggleStatus.run(key);
    };

    // Обработчик для обновления данных
    const handleRefreshData = () => {
        if (initDataRaw && initDataState && initDataState.user) {
            get.run({
                tg_id: initDataState.user.id,
                number_of_days: 7,
            });
        }
    };

    useEffect(() => {
        handleRefreshData()
    }, [initDataRaw]);

    if (get.data) {
        return <div>
            <button onClick={handleRefreshData} disabled={get.loading}>
                {get.loading ? 'Loading...' : 'Refresh Data'}
            </button>

            <ul>
                {Object.entries(get.data).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value as string}{' '}
                        <button
                            onClick={() => handleToggleStatus(key as SwaKey)}
                            disabled={toggleStatus.loading}
                        >
                            {toggleStatus.loading ? 'Updating...' : 'Toggle Status'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    }

    if (get.error) {
        return <ErrorBlock title={"Беда!"} status={"empty"} description={"Не удалось получить информацию!"}/>
    }
}

export default SWAPage;