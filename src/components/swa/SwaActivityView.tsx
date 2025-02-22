// SwaActivityView.tsx
import {FC, useState} from "react";
import {List, Button} from "antd-mobile";
import {SwaKey, SwaResponse} from "@/types/swa.ts";
import SwaChart from "./SWAChart.tsx";

interface SwaActivityViewProps {
    data: SwaResponse;
    numberOfDays: number
    onToggleStatus: (key: SwaKey) => void;
}

const SwaActivityView: FC<SwaActivityViewProps> = ({data, onToggleStatus, numberOfDays}) => {
    // Состояние для отслеживания загрузки каждого ключа
    const [loadingKeys, setLoadingKeys] = useState<Record<SwaKey, boolean>>(
        Object.keys(data).reduce((acc, key) => {
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
        <div>
            <SwaChart data={data} numberOfDays={numberOfDays} small={numberOfDays==1}/>
            <List>
                {Object.entries(data).map(([key, value]) => (
                    <List.Item
                        key={key}
                        description={`${value} раз`} // Описание (количество раз)
                        extra={
                            <Button
                                color="primary"
                                size="small"
                                onClick={() => handleToggleStatus(key as SwaKey)}
                                loading={loadingKeys[key as SwaKey]}
                                disabled={loadingKeys[key as SwaKey]}
                            >
                                {loadingKeys[key as SwaKey] ? "Updating..." : "Toggle Status"}
                            </Button>
                        }
                    >
                        {key} {/* Название действия */}
                    </List.Item>
                ))}
            </List>
        </div>
    );
};

export default SwaActivityView;