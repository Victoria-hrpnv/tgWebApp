import React, {FC, useEffect, useState} from "react";
import {CapsuleTabs, ErrorBlock} from "antd-mobile";
import SwaActivityView from "@/components/swa/SwaActivityView.tsx";
import CurrentActivities from "@/components/swa/CurrentActivities.tsx";

const textColor = {
    color : '#232e3c',
}


const SWAPage: FC = () => {

    const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("day");

    // Отображение данных
    return (
        <>
            <CapsuleTabs activeKey={selectedPeriod} onChange={(key) => {
                setSelectedPeriod(key as "day" | "week" | "month")
            }}>
                <CapsuleTabs.Tab key="day" title="Сегодня"
                                 style={textColor}
                >
                    <CurrentActivities/>
                </CapsuleTabs.Tab>
                <CapsuleTabs.Tab key="week" title="Неделя"
                                 style={textColor}
                >
                    <SwaActivityView numberOfDays={7}/>
                </CapsuleTabs.Tab>
                <CapsuleTabs.Tab key="month" title="Месяц"
                                 style={textColor}
                >
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