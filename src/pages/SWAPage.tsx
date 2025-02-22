import {FC, useEffect, useState} from "react";
import AppHeader from "@/components/AppHeader.tsx";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {initData, retrieveLaunchParams, useSignal} from "@telegram-apps/sdk-react";
import {CapsuleTabs, ErrorBlock, TabBar} from "antd-mobile";
import {SwaKey, SwaResponse} from "@/types/swa";
import {useRequest} from "ahooks";
import UserActivityList from "@/components/swa/SwaActivityView.tsx";
import SwaActivityView from "@/components/swa/SwaActivityView.tsx";

const SWAPage: FC = () => {
    const {initDataRaw} = retrieveLaunchParams();
    const initDataState = useSignal(initData.state); // Отслеживаем состояние initData
    const {fetchUserActivity, toggleUserActivityStatus} = useSwaApi(initDataRaw);
    const [numberOfDays, setNumberOfDays] = useState(1)

    // Состояние для данных о действиях пользователя
    const [userActivityData, setUserActivityData] = useState<SwaResponse | null>(null);

    // Состояние для выбранного периода (день, неделя, месяц)
    const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("day");

    // GET-запрос с использованием useRequest
    const {
        error: userActivityError,
        loading: isUserActivityLoading,
        run: fetchUserActivityRun,
    } = useRequest(fetchUserActivity, {
        manual: true, // Запрос выполняется вручную
        onSuccess: (data) => setUserActivityData(data), // Обновляем состояние при успешном запросе
    });

    // POST-запрос с использованием useRequest
    const {
        error: toggleStatusError,
        loading: isToggleStatusLoading,
        run: toggleUserActivityStatusRun,
    } = useRequest(toggleUserActivityStatus, {
        manual: true, // Запрос выполняется вручную
        onSuccess: () => {
            // После успешного POST-запроса перезагружаем данные
            handleRefreshData();
        },
    });

    // Обработчик для изменения статуса
    const handleToggleStatus = (key: SwaKey) => {
        toggleUserActivityStatusRun(key);
    };

    // Обработчик для обновления данных
    const handleRefreshData = () => {
        if (initDataRaw && initDataState?.user) {
            let number_of_days: number;
            switch (selectedPeriod) {
                case "day":
                    number_of_days = 1;
                    break;
                case "week":
                    number_of_days = 7;
                    break;
                case "month":
                    number_of_days = 30;
                    break;
                default:
                    number_of_days = 1;
            }
            setNumberOfDays(number_of_days)
            fetchUserActivityRun(initDataState.user.id, number_of_days);
        }
    };

    // Загружаем данные при монтировании компонента и при изменении initDataState или selectedPeriod
    useEffect(() => {
        handleRefreshData();
    }, [initDataRaw, initDataState, selectedPeriod]); // Зависимость от initDataState и selectedPeriod

    const handlePeriodChange = (key: string) => {
        const period = key as "day" | "week" | "month"; // Приводим key к нужному типу
        setSelectedPeriod(period);
    };

    // Отображение данных
    if (userActivityData) {
        return (
            <div>
                {/* TabBar для переключения периода */}
                <CapsuleTabs activeKey={selectedPeriod} onChange={handlePeriodChange}>
                    <CapsuleTabs.Tab key="day" title="Сегодня"/>
                    <CapsuleTabs.Tab key="week" title="Неделя"/>
                    <CapsuleTabs.Tab key="month" title="Месяц"/>
                </CapsuleTabs>

                {/* Список действий пользователя */}
                <SwaActivityView
                    data={userActivityData}
                    numberOfDays={numberOfDays}
                    onToggleStatus={handleToggleStatus}
                />
            </div>
        );
    }

    // Отображение ошибки
    if (userActivityError || toggleStatusError) {
        return (
            <ErrorBlock
                title="Беда!"
                status="empty"
                description="Не удалось получить информацию!"
            />
        );
    }

    // Отображение загрузки
    return <div>Loading...</div>;
};

export default SWAPage;