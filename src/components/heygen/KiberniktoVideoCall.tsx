import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Tag, Tabs} from "antd-mobile";
import {useAsyncEffect, useMemoizedFn, usePrevious, useUpdateEffect} from "ahooks";

import {KNOWLEDGE_ID, AVATAR_ID, LANGUAGE_ID} from "./base/constants";
import {
    AvatarQuality,
    StreamingAvatar,
    StreamingEvents,
    TaskMode,
    TaskType,
    VoiceEmotion
} from "./base/StreamingAvatar";
import AvatarVideo from "./AvatarVideo";
import {isGoodbye, sleep} from "./base/utils";
import {useKibernikto} from "@/context/KiberniktoContext.tsx";

//const {useToken} = theme;

interface KiberniktoVideoCallProps {
    closeCounter?: number;
}

const KiberniktoVideoCall: React.FC<KiberniktoVideoCallProps> = ({closeCounter = 0}) => {
    const token = {}
    const {setLastUserRequest, lastResponse, getHeygenSession} = useKibernikto();
    //const [messageApi, contextHolder] = message.useMessage();
    const [isLoadingSession, setIsLoadingSession] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [knowledgeId, setKnowledgeId] = useState<string>(KNOWLEDGE_ID);
    const [avatarId, setAvatarId] = useState<string>(AVATAR_ID);
    const [language, setLanguage] = useState<string>(LANGUAGE_ID);
    const avatar = useRef<StreamingAvatar | null>(null);
    const [isUserTalking, setIsUserTalking] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useAsyncEffect(async () => {
        if (avatar.current && stream) {
            const chatResponse = lastResponse['to_sound_out'];
            await avatar.current.speak({
                text: chatResponse,
                taskType: TaskType.REPEAT,
                taskMode: TaskMode.ASYNC,
            });
        }
    }, [lastResponse]);

    useAsyncEffect(async () => {
        console.log(closeCounter);
        if (avatar.current) {
            await endSession();
        }
    }, [closeCounter]);

    async function startSession(): Promise<void> {
        try {
            setIsLoadingSession(true);
            const newToken = await getHeygenSession();

            if (newToken == null) {
                setIsLoadingSession(false);
                //messageApi.warning("Failed to access the video stream!");
                return;
            }

            avatar.current = new StreamingAvatar({
                token: newToken,
            });

            avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
                console.log("Stream disconnected");
                endSession();
            });

            avatar.current.on(StreamingEvents.STREAM_READY, (event: CustomEvent) => {
                console.log(">>>>> STREAM_READY:", event.detail);
                setStream(event.detail);
            });

            avatar.current.on(StreamingEvents.USER_START, (event: CustomEvent) => {
                console.log("--- USER_START:", event);
                setIsUserTalking(true);
            });

            // @ts-ignore
            avatar.current.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event: CustomEvent) => {
                setIsUserTalking(true);
            });

            avatar.current.on(StreamingEvents.USER_TALKING_MESSAGE, (message: CustomEvent) => {
                console.info("---> USER_TALKING_MESSAGE:", message);
                const messageText = message?.detail?.message;
                setLastUserRequest(messageText);
                if (isGoodbye(messageText)) {
                    // @ts-ignore
                    endSession().then(r => console.log('session by user request'));
                }
            });

            avatar.current.on(StreamingEvents.USER_END_MESSAGE, (message: CustomEvent) => {
                console.log("+++ USER_END_MESSAGE:", message);
            });

            avatar.current.on(StreamingEvents.USER_STOP, (event: CustomEvent) => {
                console.log(">>>>> User stopped talking:", event);
                setIsUserTalking(false);
            });

            const res = await avatar.current.createStartAvatar({
                quality: AvatarQuality.Low,
                avatarName: avatarId,
                knowledgeId: knowledgeId,
                voice: {
                    rate: 1.5,
                    emotion: VoiceEmotion.SERIOUS,
                },
                language: language,
            });

            await avatar.current.startVoiceChat();
        } catch (error) {
            console.error("Error starting avatar session:", error);
        } finally {
            setIsLoadingSession(false);
        }
    }

    async function handleInterrupt(): Promise<void> {
        if (avatar.current) {
            try {
                await avatar.current.interrupt();
            } catch (e) {
                console.error(e);
            }
        }
    }

    async function endSession(): Promise<void> {
        await avatar.current?.stopAvatar();
        setStream(undefined);
    }

    useEffect(() => {
        return () => {
            // @ts-ignore
            endSession().then(r => console.log('session closed'));
        };
    }, []);

    const renderCardBody = () => {
        if (stream) {
            return (
                <div style={{width: "100%"}}>
                    <AvatarVideo stream={stream} endSession={endSession} handleInterrupt={handleInterrupt}/>
                </div>
            );
        }

        return (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 0,
                }}
            >
                <Button
                    //icon={<VideoCameraAddOutlined style={{fontSize: 26}}/>}
                    loading={isLoadingSession}
                    shape="rounded"
                    size={"large"}
                    style={{height: 120, width: 120}}
                    color="primary"
                    onClick={startSession}
                />
            </div>
        );
    };

    return (
        <div style={{
            height: 300,
            maxHeight: 600,
            width: "100%",
            padding: 0,
            paddingTop: 12
        }}>
            {renderCardBody()}
        </div>
    );
};

export default KiberniktoVideoCall;