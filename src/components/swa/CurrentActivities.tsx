import {FunctionComponent} from "react";
import {Divider, List, Skeleton, SwipeAction} from "antd-mobile";
import {keyDescriptions, keyLabels, SwaKey} from "@/types/swa.ts";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";
import {useRequest} from "ahooks";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {retrieveLaunchParams, themeParams, useSignal} from "@telegram-apps/sdk-react";
import {
    CheckOutline,
    CheckShieldOutline,
    CloseOutline,
    CollectMoneyOutline,

} from "antd-mobile-icons";

const CurrentActivities: FunctionComponent = () => {
    const {initDataRaw} = retrieveLaunchParams();
    const {user, userActivityToday, refresh, loading} = useSwaStatus()
    const {toggleUserActivityStatus} = useSwaApi(initDataRaw);
    const tp = useSignal(themeParams.state);

    const {
        error: toggleStatusError,
        loading: isToggleStatusLoading,
        run: toggleUserActivityStatusRun,
    } = useRequest(toggleUserActivityStatus, {
        manual: true, // Запрос выполняется вручную
        onSuccess: () => {
            // После успешного POST-запроса перезагружаем данные
            refresh();
        },
    });

    const handleToggleStatus = (key: SwaKey) => {
        if (user?.id) {
            toggleUserActivityStatusRun(user?.id, key);
        }
    };

    if (isToggleStatusLoading || toggleStatusError) {
        return <Skeleton.Paragraph lineCount={8}/>
    }

    return <div>
        <div>{initDataRaw}
        </div>
        <Divider
            style={{
                border: 'none',
                margin: '8px 0 16px',
            }}>{'Свайп для настройки радиусов'}</Divider>
        <List>
            {userActivityToday &&
                Object.entries(userActivityToday).map(([key, value]) => {
                    const closed = value
                    const leftActions = closed ? [] : [{
                        key: key,
                        text: <CheckOutline/>,
                        color: 'success',
                        onClick: async () => {
                            handleToggleStatus(key as SwaKey)
                        }
                    }]

                    const rightActions = !closed ? [] : [{
                        key: key,
                        text: <CloseOutline/>,
                        color: 'danger',
                        onClick: async () => {
                            handleToggleStatus(key as SwaKey)
                        }
                    }]
                    const iconColor = value ? '#10b981' : tp.destructiveTextColor
                    const icon = value ? <CheckShieldOutline color={iconColor}/> :
                        <CollectMoneyOutline color={iconColor}/>
                    return <SwipeAction
                        key={key}
                        leftActions={leftActions}
                        rightActions={rightActions}>
                        <List.Item style={{borderTop: ' #ff3141'}}
                                   prefix={icon}
                                   description={keyDescriptions[key as SwaKey]}>
                            {keyLabels[key as SwaKey]}
                        </List.Item>
                    </SwipeAction>
                })}
        </List>
    </div>
}

export default CurrentActivities;