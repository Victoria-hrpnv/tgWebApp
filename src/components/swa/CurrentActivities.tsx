import {FunctionComponent} from "react";
import {Divider, List, Skeleton, SwipeAction} from "antd-mobile";
import {keyDescriptions, keyLabels, SwaKey} from "@/types/swa.ts";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";
import {useRequest} from "ahooks";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {retrieveLaunchParams, themeParams, useSignal} from "@telegram-apps/sdk-react";
import {
    CheckOutline, CheckShieldFill,
    CheckShieldOutline,
    CloseOutline,
    CollectMoneyOutline,
    RightOutline,
    UnorderedListOutline
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
        console.log('gege:', key)
        if (user?.id) {
            toggleUserActivityStatusRun(user?.id, key);
        }
    };

    if (loading) {
        return <Skeleton.Paragraph lineCount={8}/>
    }

    return <div>
        <Divider
            style={{
                border: 'none',
            }}>{'Свайп для настройки радиусов'}</Divider>
        <List>
            {userActivityToday &&
                Object.entries(userActivityToday).map(([key, value]) => {
                    const closed = !!value
                    const leftActions = closed ? [] : [{
                        key: key,
                        text: <CheckOutline/>,
                        color: 'success',
                        onClick: async () => {
                            //await handleToggleStatus(key as SwaKey)
                        }
                    }]

                    const rightActions = !closed ? [] : [{
                        key: key,
                        text: <CloseOutline/>,
                        color: 'danger',
                        onClick: async () => {
                            //await handleToggleStatus(key as SwaKey)
                        }
                    }]
                    const iconColor = value ? tp.accentTextColor : tp.destructiveTextColor
                    const icon = value ? <CheckShieldOutline color={iconColor}/> : <CollectMoneyOutline color={iconColor}/>
                    return <SwipeAction

                        key={key}
                        leftActions={leftActions}
                        rightActions={rightActions}>
                        <List.Item
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