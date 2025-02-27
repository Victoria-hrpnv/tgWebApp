import {FunctionComponent} from "react";
import {List, SwipeAction} from "antd-mobile";
import {keyLabels, SwaKey} from "@/types/swa.ts";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";
import {useRequest} from "ahooks";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {retrieveLaunchParams} from "@telegram-apps/sdk-react";

const CurrentActivities: FunctionComponent = () => {
    const {initDataRaw} = retrieveLaunchParams();
    const {userActivityToday, refresh} = useSwaStatus()
    const {toggleUserActivityStatus} = useSwaApi(initDataRaw);

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
        //toggleUserActivityStatusRun(initDataState.user.id, key);
    };

    return <List>
        {userActivityToday &&
            Object.entries(userActivityToday).map(([key, value]) => (
                <SwipeAction
                    key={key}
                    leftActions={[
                        {
                            key: 'close',
                            text: value ? 'Открыть' : 'Закрыть',
                            color: value ? 'light' : 'primary',
                            onClick: async () => {
                                //await handleToggleStatus(key as SwaKey)
                            }
                        },
                    ]}>
                    <List.Item
                        description={`${value ? 'Закрыто' : 'Открыто'}`}
                    >  {keyLabels[key as SwaKey]}</List.Item>
                </SwipeAction>
            ))}
    </List>
}

export default CurrentActivities;