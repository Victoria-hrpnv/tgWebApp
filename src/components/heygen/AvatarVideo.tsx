import React, { useEffect, useRef } from "react";
import { Button, Card } from "antd-mobile";

interface AvatarVideoProps {
    stream: MediaStream | undefined;
    endSession: () => void;
    handleInterrupt: () => void;
}

const AvatarVideo: React.FC<AvatarVideoProps> = ({ stream, endSession, handleInterrupt }) => {
    const mediaStream = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (stream && mediaStream.current) {
            mediaStream.current.srcObject = stream;
            mediaStream.current.onloadedmetadata = () => {
                mediaStream.current?.play();
            };
        }
    }, [stream]);

    return (
        <div
            style={{ width: "100%", overflow: "visible", padding: 0, zIndex: 2000, position: "relative" }}
        >
            <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            >
                <track kind="captions" />
            </video>
            <div
                style={{
                    position: "absolute",
                    bottom: "36px",
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                <Button
                    //icon={<HandPayCircleOutline />}
                    shape="rounded"
                    size={"large"}
                    style={{ marginRight: "12px" }}
                    onClick={handleInterrupt}
                />
                <Button
                    //icon={<VideoCameraOutlined />}
                    shape="rounded"
                    size={"large"}
                    color={"danger"}
                    onClick={endSession}
                />
            </div>
        </div>
    );
};

export default AvatarVideo;