import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
    userId: { type: String }, // Owner of the template (Optional for system templates)
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Optional (if part of a project)
    isGlobal: { type: Boolean, default: false }, // System-wide global templates? Or User-wide?
    // Context implies User-wide sidebar, but previous task implemented System-wide.
    // Let's support both. userId is for the owner. 
    // If isGlobal=true, maybe it's a system template (no userId? or Admin userId?).
    // To keep it simple: userId is required for USER templates. 
    // System templates might have a specific userId or we make userId optional?
    // Plan said "Add userId: { type: String, required: true }".
    // Existing documents won't have it. We must handle that.
    name: { type: String, required: true },
    subject: { type: String, required: true }, // Default subject for emails using this template
    content: { type: String, required: true }, // HTML Content
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Update timestamp on save
TemplateSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

// Force model recompilation in dev to pick up schema changes
if (process.env.NODE_ENV === "development" && mongoose.models.Template) {
    delete mongoose.models.Template;
}

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
