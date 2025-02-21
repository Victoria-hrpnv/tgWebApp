// hooks/useSwaApi.ts
import {useRequest} from 'ahooks';

import {mockToggleStatus, generateMockData} from '../utils/mockData';
//const SERVER_URL = `${import.meta.env.VITE_API_URL}`
const SERVER_URL = "https://yo33d3dd32ur-asssspi-url.com"
const DEV_MODE = import.meta.env.MODE === 'development'
import { SwaKey, SwaResponse } from '../types/swa';

interface ApiResponse extends SwaResponse {} // Теперь ApiResponse соответствует SwaResponse

interface ApiError {
    message: string;
}

interface GetCurrentStateParams {
    tg_id: number;
    number_of_days: number;
}

const useSwaApi = (initDataRaw?: string) => {
    const getAuthHeader = () => {
        if (!initDataRaw) {
            throw new Error('initDataRaw is required');
        }
        return {Authorization: `tma ${initDataRaw}`};
    };

    // GET-запрос
    const {
        data: getData,
        error: getError,
        loading: getLoading,
        run: runGet,
    } = useRequest<ApiResponse, [GetCurrentStateParams]>(
        async ({tg_id, number_of_days}: GetCurrentStateParams) => {
            if (DEV_MODE) {
                return generateMockData()
            }
            const url = `${SERVER_URL}/${tg_id}/${number_of_days}`;
            const response = await fetch(url, {
                headers: getAuthHeader(),
            });

            if (!response.ok) throw new Error(`GET Error: ${response.status}`);
            return response.json();
        },
        {manual: true}
    );

    // POST-запрос
    const {
        data: postData,
        error: postError,
        loading: postLoading,
        run: runPost,
    } = useRequest<ApiResponse, [SwaKey]>(
        async (key: SwaKey) => {
            if (DEV_MODE) {
                if (!getData) throw new Error('No data available');
                return mockToggleStatus(key, getData);
            }
            const url = `${SERVER_URL}/toggle-status`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({key}),
            });

            if (!response.ok) throw new Error(`POST Error: ${response.status}`);
            return response.json();
        },
        {manual: true}
    );

    return {
        get: {
            data: getData,
            error: getError,
            loading: getLoading,
            run: runGet,
        },
        toggleStatus: {
            data: postData,
            error: postError,
            loading: postLoading,
            run: runPost,
        },
    };
};

export default useSwaApi;