// SwaActivityView.tsx
import {FC, useState} from "react";
import {Divider, List, SwipeAction} from "antd-mobile";
import {keyLabels, SwaKey, SwaResponse} from "@/types/swa.ts";
import SwaChart from "./SWAChart.tsx";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";

interface SwaActivityViewProps {
    onToggleStatus: (key: SwaKey) => void;
}

const SwaActivityView: FC<SwaActivityViewProps> = ({onToggleStatus}) => {
    const { userActivityData } = useSwaStatus();
    const {numberOfDays} = useSwaStatus()
    // Состояние для отслеживания загрузки каждого ключа
    const [loadingKeys, setLoadingKeys] = useState<Record<SwaKey, boolean>>(
        Object.keys(userActivityData as SwaResponse).reduce((acc, key) => {
            acc[key as SwaKey] = false;
            return acc;
        }, {} as Record<SwaKey, boolean>)
    );

    // Обработчик для изменения статуса
    const handleToggleStatus = async (key: SwaKey) => {
        setLoadingKeys((prev) => ({...prev, [key]: true})); // Включаем загрузку для конкретного ключа
        onToggleStatus(key); // Выполняем запрос
        setLoadingKeys((prev) => ({...prev, [key]: false})); // Выключаем загрузку

    };



    return (
        <>
            {numberOfDays !== 0 ?
                <SwaChart small={numberOfDays == 0} days = {false}/> : (
                    <>
                        <Divider
                            style={{
                                border: 'none',
                            }}>{'Смахните, чтобы изменить статус радиуса'}</Divider>
                        <List>
                        {userActivityData &&
                            Object.entries(userActivityData).map(([key, value]) => (
                                <SwipeAction
                                    key={key}
                                    rightActions={[
                                        {
                                            key: 'close',
                                            text:  value ? 'Открыть' : 'Закрыть',
                                            color:   value ? 'light' : 'primary',
                                            onClick: () => {handleToggleStatus(key as SwaKey)}
                                        },
                                    ]}>
                                    <List.Item
                                        description={`${value ? 'Закрыто' : 'Открыто'}`}
                                    >  {keyLabels[key as SwaKey]}</List.Item>
                                </SwipeAction>
                            ))}
                    </List></>
                  )

               }

        </>
    );
};

export default SwaActivityView;