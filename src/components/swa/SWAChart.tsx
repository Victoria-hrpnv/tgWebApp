// components/DiagramOfRadii.tsx
import React from "react";
import {Radar} from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import {SwaKey, keyLabels, SwaResponse} from "@/types/swa";
import {themeParams, useSignal} from "@telegram-apps/sdk-react";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";


// Регистрируем необходимые компоненты Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface SwaChartProps {
    small?: boolean;
    days: boolean
}

const SwaChart: React.FC<SwaChartProps> = ({  small = false, days}) => {
    const {userActivityData } = useSwaStatus();
    const {numberOfDays} = useSwaStatus()
    const {userDataForOneDay } = useSwaStatus();
    // Получаем цвета из текущей темы Telegram Mini Apps
    const tp = useSignal(themeParams.state);

    // Цвета из Telegram Mini Apps
    const tgColors = {
        sectionBgColor: tp.buttonColor || "rgba(255, 255, 255, 0.6)", // Фон
        border: tp.buttonColor || "#2481cc", // Акцентный цвет
        text: tp.textColor || "#000000", // Текст
        grid: tp.hintColor || "rgba(0, 0, 0, 0.1)", // Сетка
    };

    const labels =  Object.keys(userActivityData as SwaResponse).map((key) => keyLabels[key as SwaKey])


    // Преобразуем данные
    const chartData = {
        labels: labels, // Используем переводы из keyLabels
        datasets: [
            {
                label: "Activity",
                data:  Object.values(days ? userDataForOneDay as SwaResponse : userActivityData as SwaResponse) , // Значения для каждого действия
                backgroundColor: tgColors.sectionBgColor, // Цвет заливки из Telegram Mini Apps
                borderColor: tgColors.border, // Цвет границы из Telegram Mini Apps
                borderWidth: 1,
            },
        ],
    };

    // Настройки для Radar Chart
    const options = {
        scales: {
            r: {
                beginAtZero: true, // Начинаем шкалу с нуля
                max: days? 1 : numberOfDays, // Максимальное значение для 1 дня
                grid: {
                    color: tgColors.grid, // Цвет сетки из Telegram Mini Apps
                },
                ticks: {
                    maxTicksLimit: 3,
                    display: false, // Скрываем промежуточные значения на оси Y
                    stepSize: 1, // Шаг шкалы
                },
                pointLabels: {
                    display: !small, // Скрываем лейблы, если small=true
                    font: {
                        size: small ? 0 : 12, // Размер шрифта лейблов (0, если small=true)
                    },
                }
            },
        },
        plugins: {
            legend: {
                display: false, // Скрываем легенду
            },
        },
    };

    return <div style={{width: days ? '65px' : '370px' , height: days ? '65px' : 'auto' }}
    >
        <Radar data={chartData} options={options}/>;
    </div>
};

export default SwaChart;