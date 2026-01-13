import { escape } from "querystring";

interface ValidationRule {
    id: string;
    label: string;
    type: "text" | "email" | "number" | "textarea" | "checkbox" | "select" | "date" | "time";
    required: boolean;
    options?: string[];
}

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitizedData: any;
}

export function validateAndSanitize(data: any, schema: ValidationRule[] = []): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: any = {};

    // 1. Sanitize all inputs first (basic stripping)
    // If schema is provided, we only accept fields in the schema
    // If no schema, we accept everything (legacy mode)

    if (schema.length === 0) {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                let value = data[key];
                if (typeof value === "string") {
                    value = value.trim();
                    value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
                sanitizedData[key] = value;
            }
        }
        return { isValid: true, errors: [], sanitizedData };
    }

    // 2. Validate against Schema
    for (const field of schema) {
        let value = data[field.id];

        // Check required
        if (field.required && (value === undefined || value === null || value === "")) {
            errors.push(`${field.label} is required.`);
            continue;
        }

        // If value exists, validate type and sanitize
        if (value !== undefined && value !== null && value !== "") {
            if (field.type === "email") {
                if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.push(`${field.label} must be a valid email.`);
                }
            } else if (field.type === "number") {
                if (isNaN(Number(value))) {
                    errors.push(`${field.label} must be a number.`);
                } else {
                    value = Number(value);
                }
            } else if (field.type === "date") {
                if (isNaN(Date.parse(value))) {
                    errors.push(`${field.label} must be a valid date.`);
                }
            } else if (field.type === "time") {
                // Basic time validation (HH:MM or HH:MM:SS)
                const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
                if (!timeRegex.test(value)) {
                    errors.push(`${field.label} must be a valid time (HH:MM).`);
                }
            }

            // Sanitize strings
            if (typeof value === "string") {
                value = value.trim();
                value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }

            sanitizedData[field.id] = value;
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitizedData,
    };
}
