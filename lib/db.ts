import mongoose, { Mongoose } from "mongoose";




export const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("Please provide MONGODB_URI in the environment variables");
    }

    if( mongoose.connection.readyState === 1) {
        return;
    }

    if( !(global as any)._mongoosePromise) {
        (global as any)._mongoosePromise = mongoose.connect(MONGODB_URI);
    }

    try {
        await (global as any)._mongoosePromise;
    } catch (error) {
        console.log("Mongoose connection error", error);
    }
}