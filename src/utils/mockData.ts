// utils/mockData.ts
import { SwaKey } from '../types/swa';

// Тип для ответа API
type SwaResponse = {
    [key in SwaKey]: number;
};

// Функция для генерации случайных данных
export const generateMockData = (): SwaResponse => {
    const mockData: Partial<SwaResponse> = {};

    // Перебираем все ключи SwaKey
    Object.values(SwaKey).forEach((key) => {
        mockData[key] = Math.floor(Math.random() * 10); // Случайное число от 0 до 9
    });

    console.dir(mockData)
    return mockData as SwaResponse;
};

// Функция для мокового изменения статуса
export const mockToggleStatus = (key: SwaKey, currentData: SwaResponse): SwaResponse => {
    // Увеличиваем значение на 1 для выбранного ключа
    const updatedData = { ...currentData, [key]: (currentData[key] || 0) + 1 };
    return updatedData;
};