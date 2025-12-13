import mongoose from "mongoose";

export function dbHealthCheck() {
    const states: Record<number, string> = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
    };
    return states[mongoose.connection.readyState] || "unknown";
}