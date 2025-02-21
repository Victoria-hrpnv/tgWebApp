import {type FC, useMemo} from 'react';
import {initData, type User, useSignal} from '@telegram-apps/sdk-react';

import {Page} from '@/components/Page.tsx';
import {ErrorBlock, List, ResultPage} from "antd-mobile";


function getUserRows(user: User): any[] {
    return [
        {title: 'id', value: user.id.toString()},
        {title: 'username', value: user.username},
        {title: 'photo_url', value: user.photoUrl},
        {title: 'last_name', value: user.lastName},
        {title: 'first_name', value: user.firstName},
        {title: 'is_bot', value: user.isBot},
        {title: 'is_premium', value: user.isPremium},
        {title: 'language_code', value: user.languageCode},
        {title: 'allows_to_write_to_pm', value: user.allowsWriteToPm},
        {title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu},
    ];
}

export const InitDataPage: FC = () => {
    const initDataRaw = useSignal(initData.raw);
    const initDataState = useSignal(initData.state);

    const initDataRows = useMemo<any[] | undefined>(() => {
        if (!initDataState || !initDataRaw) {
            return;
        }
        const {
            authDate,
            hash,
            queryId,
            chatType,
            chatInstance,
            canSendAfter,
            startParam,
        } = initDataState;
        return [
            {title: 'raw', value: initDataRaw},
            {title: 'auth_date', value: authDate.toLocaleString()},
            {title: 'auth_date (raw)', value: authDate.getTime() / 1000},
            {title: 'hash', value: hash},
            {title: 'can_send_after', value: initData.canSendAfterDate()?.toISOString()},
            {title: 'can_send_after (raw)', value: canSendAfter},
            {title: 'query_id', value: queryId},
            {title: 'start_param', value: startParam},
            {title: 'chat_type', value: chatType},
            {title: 'chat_instance', value: chatInstance},
        ];
    }, [initDataState, initDataRaw]);

    const userRows = useMemo<any[] | undefined>(() => {
        return initDataState && initDataState.user
            ? getUserRows(initDataState.user)
            : undefined;
    }, [initDataState]);

    const receiverRows = useMemo<any[] | undefined>(() => {
        return initDataState && initDataState.receiver
            ? getUserRows(initDataState.receiver)
            : undefined;
    }, [initDataState]);

    const chatRows = useMemo<any[] | undefined>(() => {
        if (!initDataState?.chat) {
            return;
        }
        const {
            id,
            title,
            type,
            username,
            photoUrl,
        } = initDataState.chat;

        return [
            { title: 'id', value: id.toString() },
            { title: 'title', value: title },
            { title: 'type', value: type },
            { title: 'username', value: username },
            { title: 'photo_url', value: photoUrl },
        ];
    }, [initData]);

    if (!initDataRows) {
        return <Page>
                <ErrorBlock status='busy'>
                    <img
                        alt="Telegram sticker"
                        src="https://xelene.me/telegram.gif"
                        style={{display: 'block', width: '144px', height: '144px'}}
                    />
                </ErrorBlock>
            </Page>
    }

    return (
        <Page>
            <ResultPage
                status='success'
                title='Клиент'
                description='данные о телеграмм аккаунте'
            >
                {chatRows && <List>
                    {chatRows.map((item, index: number) => {
                        return <List.Item
                            key={index}
                            description={item.value}
                        >
                            {item.title}
                        </List.Item>
                    })}
                </List>}
                {userRows && <List>
                    {userRows.map((item, index: number) => {
                        return <List.Item
                            key={index}
                            description={item.value}
                        >
                            {item.title}
                        </List.Item>
                    })}
                </List>}
                {receiverRows && <List>
                    {receiverRows.map((item, index: number) => {
                        return <List.Item
                            key={index}
                            description={item.value}
                        >
                            {item.title}
                        </List.Item>
                    })}
                </List>}
            </ResultPage>

        </Page>
    );
};
