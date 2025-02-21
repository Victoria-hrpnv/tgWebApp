import {Avatar, List} from "antd-mobile";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {useState} from "react";

const AppHeader = () => {
    const initDataState = useSignal(initData.state);

    if (initDataState && initDataState.user) {
        return <List>
            <List.Item
                prefix={<Avatar src={initDataState.user.photoUrl as string}/>}
                description={initDataState.user.lastName}
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