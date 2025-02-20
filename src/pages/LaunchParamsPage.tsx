import {useLaunchParams} from '@telegram-apps/sdk-react';
import type {FC} from 'react';

import {Page} from '@/components/Page.tsx';
import {List} from "antd-mobile";


export const LaunchParamsPage: FC = () => {
    const lp = useLaunchParams();

    const items = [
        {name: 'tgWebAppPlatform', description: lp.platform},
        {name: 'tgWebAppShowSettings', description: lp.showSettings},
        {name: 'tgWebAppVersion', description: lp.version},
        {name: 'tgWebAppBotInline', description: lp.botInline},
        {name: 'tgWebAppStartParam', description: lp.startParam},
        {name: 'tgWebAppData', description: '/init-data'},
        {name: 'tgWebAppThemeParams', description: '/theme-params'},
    ]

    return (
        <Page>
            <List>
                {items.map((item, index: number) => {
                    return <List.Item
                        key={index}
                        description={item.description}
                    >
                        {item.name} {index}
                    </List.Item>
                })}
            </List>
        </Page>
    );
};
