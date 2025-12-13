import mongoose, { Schema, Types } from "mongoose";

const MailLogSchema = new Schema({
  projectId: { type: Types.ObjectId, ref: "Project", required: true, index: true },
  event: { type: String, required: true }, // e.g. delivered, bounced, blocked
  subject: { type: String },
  to: { type: String },
  status: { type: String },
  meta: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.MailLog || mongoose.model("MailLog", MailLogSchema);
