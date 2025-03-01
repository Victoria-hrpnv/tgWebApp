import React, {FC, useEffect, useState} from "react";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {initData, initDataState, retrieveLaunchParams, useSignal} from "@telegram-apps/sdk-react";
import {CapsuleTabs, ErrorBlock} from "antd-mobile";
import {SwaKey, SwaResponse} from "@/types/swa";
import {useRequest} from "ahooks";
import SwaActivityView from "@/components/swa/SwaActivityView.tsx";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";
import CurrentActivities from "@/components/swa/CurrentActivities.tsx";

const SWAPage: FC = () => {

    const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("day");

    // Отображение данных
    return (
        <>
            <CapsuleTabs activeKey={selectedPeriod} onChange={(key) => {
                setSelectedPeriod(key as "day" | "week" | "month")
            }}>
                <CapsuleTabs.Tab key="day" title="Сегодня">
                    <CurrentActivities/>
                </CapsuleTabs.Tab>
                <CapsuleTabs.Tab key="week" title="Неделя">
                    <SwaActivityView numberOfDays={7}/>
                </CapsuleTabs.Tab>
                <CapsuleTabs.Tab key="month" title="Месяц">
                    <SwaActivityView numberOfDays={30}/>
                </CapsuleTabs.Tab>
            </CapsuleTabs>

            {/*<SwaActivityView
                    onToggleStatus={handleToggleStatus}
                />*/}
        </>
    );
};

export default SWAPage;