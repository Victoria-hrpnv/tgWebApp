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

export const IndexPage: FC = () => {
    return (
        <Page back={false}>
            <Link to="/ton-connect">
                <Result title={"Features"}
                        icon={<Image src={tonSvg} style={{backgroundColor: '#007AFF'}}/>}
                        description={"You can use these pages to learn more about features, provided by Telegram Mini Apps and other useful projects"}/>

            </Link>
            <Link to="/init-data">
                <List.Item title={'Init data'} prefix={<UnorderedListOutline/>} onClick={() => {
                }}>
                    Base init params
                </List.Item>
            </Link>


            <Link to="/launch-params">
                <List.Item prefix={<PayCircleOutline/>} onClick={() => {
                }}>
                    总资产
                </List.Item>
            </Link>
            <Link to="/theme-params">
                <List.Item prefix={<SetOutline/>} onClick={() => {
                }}>
                    设置
                </List.Item>
            </Link>

        </Page>
    );
};
