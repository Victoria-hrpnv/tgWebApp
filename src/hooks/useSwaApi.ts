// hooks/useSwaApi.ts
import {SwaKey, SwaResponse, ToggleStatusResponse} from '../types/swa';
import {getMockData, mockToggleStatus} from '../utils/mockSwaData.ts';


const SERVER_URL = import.meta.env.VITE_API_URL;
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'development'; // Проверка режима разработки

console.log(import.meta.env);

const useSwaApi = (initDataRaw?: string) => {
    const getAuthHeader = () => {
        if (!initDataRaw) {
            throw new Error('initDataRaw is required');
        }
        return {Authorization: `tma ${initDataRaw}`};
    };

    // GET-запрос: Получение данных о действиях пользователя
    const fetchUserActivity = async (tg_id: number, number_of_days: number): Promise<SwaResponse> => {
        // Если в режиме разработки, возвращаем мок-данные
        if (DEV_MODE) {
            return new Promise(resolve =>
                setTimeout(() => resolve(getMockData(number_of_days) as SwaResponse), 1000) // задержка 100мс
            );
        }
        // Иначе делаем реальный запрос
        const url = `${SERVER_URL}/${tg_id}/${number_of_days}`;
        const response = await fetch(url, {
            headers: getAuthHeader(),
        });
        if (!response.ok) throw new Error(`GET Error: ${response.status}`);
        return response.json();
    };

    // POST-запрос: Изменение статуса
    const toggleUserActivityStatus = async (tg_id: number, key: SwaKey): Promise<ToggleStatusResponse> => {
        // Если в режиме разработки, используем мок-функцию
        if (DEV_MODE) {
            return new Promise(resolve =>
                setTimeout(() => resolve(mockToggleStatus(key, 0)), 1000) // задержка 100мс
            );
        }


        // Иначе делаем реальный запрос
        const url = `${SERVER_URL}/toggle-status`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({key, userId: tg_id}),

        });

        if (!response.ok) throw new Error(`POST Error: ${response.status}`);
        return response.json();
    };

    return {
        fetchUserActivity,
        toggleUserActivityStatus,
    };
};

export default useSwaApi;