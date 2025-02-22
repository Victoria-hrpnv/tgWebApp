// components/DiagramOfRadii.tsx
import React from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { SwaKey, SwaResponse } from "@/types/swa";
import { keyLabels } from "@/types/swa";

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface DiagramOfRadiiProps {
    data: SwaResponse;
}

const SwaChart: React.FC<DiagramOfRadiiProps> = ({ data }) => {
    // Преобразуем данные
    const chartData = {
        labels: Object.keys(data).map((key) => keyLabels[key as SwaKey]), // Используем переводы из keyLabels
        datasets: [
            {
                label: "Activity",
                data: Object.values(data), // Значения для каждого действия
                backgroundColor: "rgba(136, 132, 216, 0.6)", // Цвет заливки
                borderColor: "rgba(136, 132, 216, 1)", // Цвет границы
                borderWidth: 1,
            },
        ],
    };

    // Настройки для Radar Chart
    const options = {
        scales: {
            r: {
                beginAtZero: true, // Начинаем шкалу с нуля
                ticks: {
                    stepSize: 1, // Шаг шкалы
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Скрываем легенду
            },
        },
    };

    return <Radar data={chartData} options={options} />;
};

export default SwaChart;