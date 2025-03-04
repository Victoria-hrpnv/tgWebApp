// hooks/useKiberniktoApi.ts
import {getMockData, mockHeygenToken} from '../utils/mockHeygenData'; // Мок-данные для разработки
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";

const SERVER_URL = import.meta.env.VITE_API_URL; // Базовый URL API
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'development'; // Проверка режима разработки

// Типы для ответов API
interface LlmResponse {
    data: any; // Замените `any` на конкретный тип, если известна структура ответа
}

interface HeygenTokenResponse {
    token: string; // Замените `string` на конкретный тип, если токен имеет другую структуру
}

const useKiberniktoApi = (initDataRaw?: string) => {
    const {user} = useSwaStatus();
    const getAuthHeader = () => {
        if (!initDataRaw) {
            throw new Error('initDataRaw is required');
        }
        return {Authorization: `tma ${initDataRaw}`};
    };
    // GET-запрос: Получение токена для Heygen
    const fetchHeygenAccessToken = async (): Promise<HeygenTokenResponse> => {
        // Если в режиме разработки, возвращаем мок-данные
        if (DEV_MODE) {
            return new Promise((resolve) =>
                setTimeout(() => resolve(mockHeygenToken("abc")), 1000) // Задержка 1 секунда
            );
        }

        // Иначе делаем реальный запрос
        const url = `${SERVER_URL}/video/video_session`;
        const response = await fetch(url, {
            headers: getAuthHeader(),
            method: 'GET',
        });

        if (!response.ok) throw new Error(`GET Error: ${response.status}`);
        return response.json();
    };

    // POST-запрос: Вызов LLM (Kibernikto)
    const llmCall = async (key: string, content: string): Promise<LlmResponse> => {
        // Если в режиме разработки, возвращаем мок-данные
        if (DEV_MODE) {
            return new Promise((resolve) =>
                setTimeout(() => resolve(getMockData(key, content)), 1000) // Задержка 1 секунда
            );
        }

        // Иначе делаем реальный запрос
        const url = `${SERVER_URL}/video/chat`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content}),
        });

        if (!response.ok) throw new Error(`POST Error: ${response.status}`);
        return response.json();
    };

    return {
        fetchHeygenAccessToken,
        llmCall,
    };
};

export default useKiberniktoApi;