import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    avatar: { type: String },
    preferences: {
        theme: { type: String, default: "system" }, // system, light, dark
        notifications: {
            emailDigest: { type: Boolean, default: false },
            securityAlerts: { type: Boolean, default: true }
        }
    }
});

if (process.env.NODE_ENV === "development" && mongoose.models.User) {
    delete mongoose.models.User;
}

export const User = mongoose.models.User || mongoose.model("User", UserSchema);