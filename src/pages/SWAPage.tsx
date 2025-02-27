import {FC,  useEffect, useState} from "react";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {initData, retrieveLaunchParams, useSignal} from "@telegram-apps/sdk-react";
import { CapsuleTabs,  ErrorBlock} from "antd-mobile";
import {SwaKey, SwaResponse} from "@/types/swa";
import {useRequest} from "ahooks";
import SwaActivityView from "@/components/swa/SwaActivityView.tsx";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";

const SWAPage: FC = () => {
    const {initDataRaw} = retrieveLaunchParams();
    const initDataState = useSignal(initData.state); // Отслеживаем состояние initData
    const {fetchUserActivity, toggleUserActivityStatus} = useSwaApi(initDataRaw);
    const { setNumberOfDays} = useSwaStatus()
    const { userActivityData, setUserActivityData } = useSwaStatus();
    const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("day");
    const {setUserDataForOneDay} =  useSwaStatus();
    // GET-запрос с использованием useRequest
    const {
        error: userActivityError,
        loading: isUserActivityLoading,
        run: fetchUserActivityRun,
    } = useRequest(fetchUserActivity, {
        manual: true, // Запрос выполняется вручную
        onSuccess: (data) => {
            setUserActivityData(data)
            if (selectedPeriod === 'day') {
                setUserDataForOneDay(data)
            }
        },
        // Обновляем состояние при успешном запросе
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
        if (initDataRaw && initDataState?.user){
            console.log('gege:',key)
            toggleUserActivityStatusRun(initDataState.user.id, key );
        }

    };

    // Обработчик для обновления данных
    const handleRefreshData = () => {
        if (initDataRaw && initDataState?.user) {
            let number_of_days: number;
            switch (selectedPeriod) {
                case "day":
                    number_of_days = 0;
                    break;
                case "week":
                    number_of_days = 7;
                    break;
                case "month":
                    number_of_days = 30;
                    break;
                default:
                    number_of_days = 0;
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

    // Отображение данных
    if (userActivityData) {
        return (
            <>
                <CapsuleTabs activeKey={selectedPeriod} onChange={(key) => handlePeriodChange(key)}>
                    <CapsuleTabs.Tab key="day" title="Сегодня"/>
                    <CapsuleTabs.Tab key="week" title="Неделя"/>
                    <CapsuleTabs.Tab key="month" title="Месяц"/>
                </CapsuleTabs>

                <SwaActivityView
                    onToggleStatus={handleToggleStatus}
                />
            </>
        );
    }



    // Отображение загрузки
    return <div>Loading...</div>;
};

export default SWAPage;