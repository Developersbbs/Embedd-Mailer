import { validateAndSanitize } from "../lib/validation";

const schema = [
    {
        id: "email",
        label: "Email Address",
        type: "email" as const,
        required: true,
    },
    {
        id: "age",
        label: "Age",
        type: "number" as const,
        required: true,
    },
    {
        id: "bio",
        label: "Bio",
        type: "textarea" as const,
        required: false,
    }
];

async function runVerification() {
    console.log("Running Schema Validation Verification...");

    // Test 1: Valid Data
    const validData = {
        email: "test@example.com",
        age: "25",
        bio: "Hello world",
        extra: "Should be ignored"
    };
    const result1 = validateAndSanitize(validData, schema);
    if (result1.isValid && result1.sanitizedData.email === "test@example.com" && result1.sanitizedData.age === 25 && !result1.sanitizedData.extra) {
        console.log("✅ Test 1 Passed: Valid data accepted and sanitized");
    } else {
        console.error("❌ Test 1 Failed:", result1);
    }

    // Test 2: Invalid Email
    const invalidEmail = {
        email: "not-an-email",
        age: "25"
    };
    const result2 = validateAndSanitize(invalidEmail, schema);
    if (!result2.isValid && result2.errors.some(e => e.includes("valid email"))) {
        console.log("✅ Test 2 Passed: Invalid email rejected");
    } else {
        console.error("❌ Test 2 Failed:", result2);
    }

    // Test 3: Missing Required Field
    const missingField = {
        email: "test@example.com"
    };
    const result3 = validateAndSanitize(missingField, schema);
    if (!result3.isValid && result3.errors.some(e => e.includes("Age is required"))) {
        console.log("✅ Test 3 Passed: Missing required field rejected");
    } else {
        console.error("❌ Test 3 Failed:", result3);
    }

    // Test 4: Invalid Number
    const invalidNumber = {
        email: "test@example.com",
        age: "not-a-number"
    };
    const result4 = validateAndSanitize(invalidNumber, schema);
    if (!result4.isValid && result4.errors.some(e => e.includes("Age must be a number"))) {
        console.log("✅ Test 4 Passed: Invalid number rejected");
    } else {
        console.error("❌ Test 4 Failed:", result4);
    }

    // Test 5: Empty Schema (Legacy Mode)
    const legacyData = {
        anyField: "allowed"
    };
    const result5 = validateAndSanitize(legacyData, []);
    if (result5.isValid && result5.sanitizedData.anyField === "allowed") {
        console.log("✅ Test 5 Passed: Empty schema allows any data");
    } else {
        console.error("❌ Test 5 Failed:", result5);
    }
}

runVerification();
