import {themeParams, useSignal} from '@telegram-apps/sdk-react';
import type {FC} from 'react';
import {List} from "antd-mobile";
import {Page} from "@/components/Page.tsx";

export const ThemeParamsPage: FC = () => {
    const tp = useSignal(themeParams.state);

    console.log(tp)

    const params = Object
        .entries(tp)
        .map(([title, value]) => ({
            title: title,
            value,
        }))

    return <Page>
        <List>
            {params.map((item, index: number) => {
                return <List.Item
                    key={index}
                    description={item.value}
                >
                    {item.title}
                </List.Item>
            })}
        </List>
    </Page>
};
