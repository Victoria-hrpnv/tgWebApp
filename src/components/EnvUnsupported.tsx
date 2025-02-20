import {retrieveLaunchParams, isColorDark, isRGB} from '@telegram-apps/sdk-react';
import {useMemo} from 'react';
import {Result} from "antd-mobile";

export function EnvUnsupported() {
    const [platform, isDark] = useMemo(() => {
        let platform = 'base';
        let isDark = false;
        try {
            const lp = retrieveLaunchParams();
            const {bgColor} = lp.themeParams;
            platform = lp.platform;
            isDark = bgColor && isRGB(bgColor) ? isColorDark(bgColor) : false;
        } catch { /* empty */
        }

        return [platform, isDark];
    }, []);

    return (
        <Result
            status='error'
            title='Oops'
            icon={'https://xelene.me/telegram.gif'}
            description='You are using too old Telegram client to run this application'
        />
    );
}