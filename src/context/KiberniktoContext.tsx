import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import useHeygenApi from "@/hooks/useHeygenApi.ts";
import {retrieveLaunchParams} from "@telegram-apps/sdk-react";

// Определение типов для контекста
interface KiberniktoContextType {
    lastUserRequest: string;
    setLastUserRequest: (request: string) => void;
    lastResponse: any; // Замените `any` на конкретный тип, если известна структура ответа
    setLastResponse: (response: any) => void; // Замените `any` на конкретный тип
    heygenToken: string | null;
    askKibernikto: (content: string) => Promise<any>; // Замените `any` на конкретный тип
    getHeygenSession: () => Promise<string>; // Замените `string` на конкретный тип, если токен имеет другой тип
}

// Создание контекста с типом
const KiberniktoContext = createContext<KiberniktoContextType | undefined>(undefined);

let clientId = localStorage.getItem('clientId');

if (!clientId) {
    clientId = Math.floor(Math.random() * 1000000).toString(); // или используй uuid
    localStorage.setItem('clientId', clientId);
}

// Определение типов для пропсов провайдера
interface KiberniktoProviderProps {
    children: ReactNode;
}

export const KiberniktoProvider: React.FC<KiberniktoProviderProps> = ({children}) => {
    const {initDataRaw} = retrieveLaunchParams();
    const [lastUserRequest, setLastUserRequest] = useState<string>('');
    const [conversationKey, setConversationKey] = useState<string>(clientId);
    const [lastResponse, setLastResponse] = useState<any>(null); // Замените `any` на конкретный тип
    const [heygenToken, setHeygenToken] = useState<string | null>(null);
    const {llmCall, fetchHeygenAccessToken} = useHeygenApi(initDataRaw);

    const askKibernikto = async (content: string): Promise<any> => { // Замените `any` на конкретный тип
        try {
            console.log(conversationKey);
            const server_response = await llmCall(conversationKey, content);
            setLastResponse(server_response);
            return server_response;
        } catch (error: any) {
            console.error('Error asking Kibernikto:', error.response);
            return "Failed to load Kibernikto: " + error.response.message;
        }
    };

    const getHeygenSession = async (): Promise<string> => { // Замените `string` на конкретный тип, если токен имеет другой тип
        try {
            const tokenResponse = await fetchHeygenAccessToken();
            return tokenResponse.token;
        } catch (error) {
            console.error('Error getting Heygen session:', error);
            throw error;
        }
    };

    const value: KiberniktoContextType = {
        lastUserRequest,
        setLastUserRequest,
        lastResponse,
        setLastResponse,
        heygenToken,
        askKibernikto,
        getHeygenSession,
    };

    return (
        <KiberniktoContext.Provider value={value}>
            {children}
        </KiberniktoContext.Provider>
    );
};

// Хук для использования контекста
export const useKibernikto = (): KiberniktoContextType => {
    const context = useContext(KiberniktoContext);
    if (!context) {
        throw new Error('useKibernikto must be used within a KiberniktoProvider');
    }
    return context;
};