import {Avatar, List} from "antd-mobile";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import SwaChart from "@/components/swa/SWAChart.tsx";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";

const AppHeader = () => {
    const initDataState = useSignal(initData.state);
    const {numberOfDays} = useSwaStatus()
    const { userActivityData } = useSwaStatus();

    if (initDataState && initDataState.user && userActivityData) {
        return <List>
            <List.Item
                prefix={<Avatar src={initDataState.user.photoUrl as string}/>}
                description={initDataState.user.lastName}
                extra={<SwaChart small={true} days = {true}/>}
            >
                {initDataState.user.firstName}
            </List.Item></List>
    } else {
        return <List>
            <List.Item
                prefix={<Avatar src={'https://avatar.iran.liara.run/public/12'}/>}
                description='Deserunt dolor ea eaque eos'
            >
                Novalee Spicer
            </List.Item></List>
    }


}

export default AppHeader;