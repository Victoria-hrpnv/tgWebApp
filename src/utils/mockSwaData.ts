// utils/mockSwaData.ts
import { SwaKey, ToggleStatusResponse } from '../types/swa';

// Тип для ответа API
type SwaResponse = {
    [key in SwaKey]: number;
};

// Данные для каждого количества дней
type MockDataStore = Record<number, SwaResponse>;

// Инициализация данных для каждого количества дней
const SWA_DATA: MockDataStore = {};

// Функция для генерации случайных данных
export const generateMockData = (number_of_days: number): SwaResponse => {
    const mockData: SwaResponse = {
        [SwaKey.SWA_KEY_1]: 0,
        [SwaKey.SWA_KEY_2]: 0,
        [SwaKey.SWA_KEY_3]: 0,
        [SwaKey.SWA_KEY_4]: 0,
        [SwaKey.SWA_KEY_5]: 0,
        [SwaKey.SWA_KEY_6]: 0,
        [SwaKey.SWA_KEY_7]: 0,
        [SwaKey.SWA_KEY_8]: 0,
    };

    // Перебираем все ключи SwaKey
    Object.values(SwaKey).forEach((key) => {
        mockData[key] = Math.floor(Math.random() * (!number_of_days? 2 : number_of_days + 1)); // Случайное число от 0 до number_of_days
    });

    // Обновляем данные для выбранного количества дней
    SWA_DATA[number_of_days] = mockData;
    return mockData;
};

// Функция для мокового изменения статуса
    export const mockToggleStatus = (
        key: SwaKey,
        number_of_days: number
    ): ToggleStatusResponse => {

        if (number_of_days == 0) {
            SWA_DATA[number_of_days] = {
                ...SWA_DATA[number_of_days],
                [key]: (SWA_DATA[number_of_days][key]) ? 0 : 1,
            };
        } else { SWA_DATA[number_of_days] = {
            ...SWA_DATA[number_of_days],
            [key]: (SWA_DATA[number_of_days][key] || 0) + 1,};
        }
        // Увеличиваем значение на 1 для выбранного ключа и количества дней
        return { success: true };
    };


// Функция для получения данных по количеству дней
export const getMockData = (number_of_days: number): SwaResponse => {
    if (!SWA_DATA[number_of_days]) {
        // Если данных для этого количества дней нет, генерируем их
        SWA_DATA[number_of_days] = generateMockData(number_of_days);
    }
    return SWA_DATA[number_of_days];
};