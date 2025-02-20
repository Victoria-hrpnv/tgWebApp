import {openLink} from '@telegram-apps/sdk-react';
import {TonConnectButton, useTonWallet} from '@tonconnect/ui-react';
import type {FC} from 'react';

import {DisplayData} from '@/components/DisplayData/DisplayData.tsx';
import {Page} from '@/components/Page.tsx';

import './TONConnectPage.css';
import {Result} from "antd-mobile";

export const TONConnectPage: FC = () => {
    const wallet = useTonWallet();

    if (!wallet) {
        return (
            <Page>
                <TonConnectButton className="ton-connect-page__button"/>
            </Page>
        );
    }

    const {
        account: {chain, publicKey, address},
        device: {
            appName,
            appVersion,
            maxProtocolVersion,
            platform,
            features,
        },
    } = wallet;

    return (
        <Page>
            {appName}
            {'imageUrl' in wallet && (
                <>
                    <Result
                        status='success'
                        title={wallet.name}
                        description='内容详情可折行，建议不超过两行建议不超过两行建议不超过两行'
                    />
                    <TonConnectButton className="ton-connect-page__button-connected"/>

                </>
            )}

        </Page>
    );
};
