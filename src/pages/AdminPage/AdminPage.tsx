import type {FC} from 'react';
import {Link} from '@/components/Link/Link.tsx';
import {Page} from '@/components/Page.tsx';

import {
    UnorderedListOutline,
    PayCircleOutline,
    SetOutline,
    ArrowsAltOutline,
} from 'antd-mobile-icons'
import tonSvg from './ton.svg';
import {List, Result, Image} from "antd-mobile";

export const AdminPage: FC = () => {
    return (
        <Page back={true}>
            <Result title={"App information"}
                    icon={<Image src={tonSvg} style={{backgroundColor: '#007AFF'}}/>}
                    description={"You can use these pages to learn more about features, provided by Telegram Mini Apps and other useful projects"}/>

            <List>
                <Link to="/ton-connect">
                    <List.Item title={'Ton wallet'} prefix={<UnorderedListOutline/>} onClick={() => {
                    }}>
                        Ton wallet connection
                    </List.Item>
                </Link>
                <Link to="/launch-params">
                    <List.Item title={'Client data'} prefix={<UnorderedListOutline/>} onClick={() => {
                    }}>
                        Base init params
                    </List.Item>
                </Link>
                <Link to="/launch-params">
                    <List.Item title={'Launch data'} prefix={<PayCircleOutline/>} onClick={() => {
                    }}>
                        Application information
                    </List.Item>
                </Link>
                <Link to="/theme-params">
                    <List.Item title={'Theme data'} prefix={<SetOutline/>} onClick={() => {
                    }}>
                        Color theme info
                    </List.Item>
                </Link>
            </List>


        </Page>
    );
};
