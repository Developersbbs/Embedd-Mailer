import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    projectId: { type: String, required: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    ip: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
    spamDetected: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
