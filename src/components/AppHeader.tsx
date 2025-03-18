import {Avatar, List, Skeleton} from "antd-mobile";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import SwaChart from "@/components/swa/SWAChart.tsx";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";

const AppHeader = () => {
    const {user, userActivityToday} = useSwaStatus();
    if (user && userActivityToday) {
        const photoUrl = user.photoUrl ? user.photoUrl : 'https://zz-33.ru/assets/templates/zz-33/img/img/slide-4-background-1.png'
        return <List>
            <List.Item
                prefix={<Avatar src={photoUrl as string}/>}
                description={user.lastName}
                extra={<SwaChart small={true} numberOfDays={0} activityData={userActivityToday}/>}
            >
                {user.firstName}
            </List.Item></List>
    } else {
        return <List>
            <List.Item>
                <Skeleton.Title animated/>
            </List.Item>
        </List>
    }


}

export default AppHeader;