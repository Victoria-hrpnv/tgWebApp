// types/swa.ts
export enum SwaKey {
    SWA_KEY_1 = "swa_key_1",
    SWA_KEY_2 = "swa_key_2",
    SWA_KEY_3 = "swa_key_3",
    SWA_KEY_4 = "swa_key_4",
    SWA_KEY_5 = "swa_key_5",
    SWA_KEY_6 = "swa_key_6",
    SWA_KEY_7 = "swa_key_7",
    SWA_KEY_8 = "swa_key_8",
}

export const keyLabels: Record<SwaKey, string> = {
    [SwaKey.SWA_KEY_1]: 'Утренняя настройка',
    [SwaKey.SWA_KEY_2]: 'Планирование',
    [SwaKey.SWA_KEY_3]: 'Прогулка',
    [SwaKey.SWA_KEY_4]: 'Активный спорт',
    [SwaKey.SWA_KEY_5]: 'Навыки, деньги, статус',
    [SwaKey.SWA_KEY_6]: 'Творчество',
    [SwaKey.SWA_KEY_7]: 'MMMM',
    [SwaKey.SWA_KEY_8]: 'Урок благодарности',
};

export type SwaResponse = {
    [key in SwaKey]: number;
};