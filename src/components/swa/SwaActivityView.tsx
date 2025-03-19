
// SwaActivityView.tsx
import {FC, useEffect, useState} from "react";
import {Divider, List, Skeleton} from "antd-mobile";
import {keyLabels, SwaKey, SwaResponse} from "@/types/swa.ts";
import SwaChart from "./SWAChart.tsx";
import {useSwaStatus} from "@/hooks/useSwaStatus.ts";
import {useRequest} from "ahooks";
import useSwaApi from "@/hooks/useSwaApi.ts";
import {retrieveLaunchParams} from "@telegram-apps/sdk-react";

interface SwaActivityViewProps {
    numberOfDays: number,
    period: "day" | "week" | "month"
}

const SwaActivityView: FC<SwaActivityViewProps> = ({numberOfDays, period}) => {
    const {initDataRaw} = retrieveLaunchParams();
    const {fetchUserActivity} = useSwaApi(initDataRaw);
    const {user} = useSwaStatus();
    const [data, setData] = useState<SwaResponse | null>(null);

    const {
        error,
        loading,
        run: refreshData,
    } = useRequest(fetchUserActivity, {
        manual: true,
        onSuccess: (data: SwaResponse) => {
            console.table(data)
            setData(data)
        }
    });

    useEffect(() => {
        refresh()
    }, [period]);

    const refresh = () => {
        if (user?.id) {
            console.log("refreshing the data for " + numberOfDays)
            refreshData(user?.id, numberOfDays)
        }
    }

    if (loading || !data) {
        return <Skeleton.Paragraph lineCount={5} animated/>
    }

    return (
        <div>
            <SwaChart small={false} numberOfDays={numberOfDays} activityData={data as SwaResponse}/>
        </div>
    );
};

export default SwaActivityView;