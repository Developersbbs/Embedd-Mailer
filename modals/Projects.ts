import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true },
    allowedDomains: { type: [String], default: [] },
    smtpSettings: {
        host: { type: String },
        port: { type: Number },
        secure: { type: Boolean },
        username: { type: String },
        password: { type: String },
        fromEmail: { type: String },
        toEmail: { type: String },
    },
    formSchema: [{
        id: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, required: true, enum: ["text", "email", "number", "textarea", "checkbox", "select"] },
        required: { type: Boolean, default: false },
        options: { type: [String] },
        placeholder: { type: String },
    }],
    emailTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" }, // Active template for emails
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
});

// Force model recompilation in dev to pick up schema changes
if (process.env.NODE_ENV === "development" && mongoose.models.Project) {
    delete mongoose.models.Project;
}

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);