"use client";

import TemplateEditor from "@/components/projects/template-editor";

export default function NewGlobalTemplatePage() {
    return (
        <div className="p-6 h-full">
            <TemplateEditor
                mode="create"
                apiEndpoint="/api/templates"
                redirectUrl="/app/templates"
            />
        </div>
    );
}
