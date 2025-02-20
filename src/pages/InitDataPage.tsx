import {type FC, useMemo} from 'react';
import {initData, type User, useSignal} from '@telegram-apps/sdk-react';

import {Page} from '@/components/Page.tsx';
import {ErrorBlock, ResultPage} from "antd-mobile";


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


    if (!initDataRows) {
        return (
            <Page>
                <ErrorBlock status='busy'>
                    <img
                        alt="Telegram sticker"
                        src="https://xelene.me/telegram.gif"
                        style={{display: 'block', width: '144px', height: '144px'}}
                    />
                </ErrorBlock>
            </Page>
        )
            ;
    }
    return (
        <Page>
            <ResultPage
                status='success'
                title='操作成功'
                description='内容详情可折行，建议不超过两行建议不超过两行建议不超过两行'
            />
        </Page>
    );
};
