
import { useContext } from "react";
import { SwaStatusContext } from "@/context/SwaStatusContext";

export const useSwaStatus = () => {
    const context = useContext(SwaStatusContext);
    if (!context) {
        throw new Error('useSwaStatus must be used within a SwaStatusProvider');
    }
    return context;
};