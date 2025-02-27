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
    const [numberOfDays, setNumberOfDays] = useState(0)
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
                <SwaChart small={numberOfDays == 0} days={false}/> : (
                    <>
                        <Divider
                            style={{
                                border: 'none',
                            }}>{'Смахните, чтобы изменить статус радиуса'}</Divider>
                        </>
                )

            }

        </>
    );
};

export default SwaActivityView;