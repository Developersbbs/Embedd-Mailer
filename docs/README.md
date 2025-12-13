# 📧 Secure Form Submission Platform  
A backend platform that allows any HTML/JS website to submit forms securely to a dynamic API endpoint, where inputs are **validated, sanitized, spam-filtered, and delivered via SMTP** to a configured email address.

This application functions as a **self-hosted alternative to Formspree / Web3Forms**, with full multi-project support and per-project SMTP configuration.

---

# 🚀 Features

- Multi-user authentication (JWT)
- Create unlimited projects
- Dynamic API endpoint per project
- API Key authentication layer
- Allowed-domain / Origin validation
- Advanced spam protection:
  - Honeypot field
  - Rate limiting
  - CAPTCHA (optional)
  - Blocked IP detection
- Server-side validation & sanitization
- SMTP mailer per project (Gmail, Outlook, Zoho, custom SMTP)
- Form submission logs & analytics
- Dashboard for managing projects
- Secure, scalable, and production-ready

---

# 📌 High-Level System Flow

Client Website Form
↓ POST
Form Submission API (/api/forms/:projectId/submit)
↓
API Key Authentication
↓
Origin / Allowed Domain Check
↓
Spam Filtering (honeypot, captcha, rate-limit)
↓
Validation (required fields, email fields)
↓
Sanitization (strip HTML, scripts, unsafe chars)
↓
SMTP Email Sending
↓
Store Submission Logs
↓
Return Success / Error


---

# 🗄️ Database Structure

### Users
Stores registered platform users.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique user ID |
| email | string | User email |
| password_hash | string | Bcrypt hash |
| name | string | User’s name |
| created_at | Date | Timestamp |
| updated_at | Date | Timestamp |

---

### Projects  
Each project represents one form backend configuration.

Key fields include:

- `projectId` (API endpoint identifier)
- `apiKey` (secret token)
- `allowedDomains`
- `smtp` (host, port, user, pass, fromEmail, toEmail)
- `validationRules`
- `spamProtection`
- `status`

---

### Form Submissions  
Stores every sanitized submission for logs/analytics.

- `projectId`
- `data` (JSON)
- `ip`
- `userAgent`
- `referrer`
- `spamDetected`
- `createdAt`

---

### Optional Collections
- `api_keys` – Multi-key support per project
- `blocked_ips` – Blocked IP address list

---

# 🔑 API Key Purpose

Each project gets a unique **API key** used to:

1. Authenticate form submissions  
2. Prevent unauthorized or malicious use  
3. Identify which project config to load  
4. Apply project-level rate limits and validation rules  
5. Secure endpoint even if URL is public

**Without a valid API Key → submissions are rejected.**

---

# 🔧 Complete Technical Flow

Below is the full backend execution pipeline when a form is submitted.

---

## 1. Load Project
Backend loads project:

SELECT * FROM projects WHERE projectId = :projectId


If not found → `404`.

---

## 2. API Key Verification
Client must send:

X-API-Key: <project_api_key>


If mismatch → `401 Unauthorized`.

---

## 3. Allowed Domain / Origin Check
Backend compares HTTP `Origin` header with:


If mismatch → `401 Unauthorized`.

---

## 3. Allowed Domain / Origin Check
Backend compares HTTP `Origin` header with:

project.allowedDomains[]


If domain isn’t whitelisted → `403 Forbidden`.

---

## 4. Spam Protection

### Honeypot Field
If hidden honeypot input contains a value → bot → reject.

### Rate Limiting
Prevent repeated submissions within a short timeframe.

### CAPTCHA (Optional)
Supports:
- Google reCAPTCHA
- Cloudflare Turnstile

### Blocked IP Check
Reject known spam IPs.

---

## 5. Validation Layer
Checks:

- Required fields exist  
- Email fields match regex  
- Field lengths ≤ max allowed length  

If invalid → `400 Bad Request`.

---

## 6. Sanitization Layer
Sanitize all inputs:

- Strip HTML tags  
- Remove `<script>` tags  
- Trim whitespace  
- Escape characters  
- Normalize unicode  
- Prevent header injection  

Ensures safe email + safe logs.

---

## 7. Email Preparation
Backend generates email:

**Plain text + HTML:**

New Submission:
Name: John
Email: john@example.com

Message: Hello...


---

## 8. SMTP Mail Sending
Using Nodemailer with project's SMTP config:

smtp.host
smtp.port
smtp.user
smtp.pass
smtp.fromEmail
smtp.toEmail



Email is delivered via secure TLS/SSL.

---

## 9. Store Submission Log

Inserted into `form_submissions`:

- Sanitized data  
- IP address  
- Referrer  
- User agent  
- Spam markers  
- Timestamp  

Used for analytics & dashboard.

---

## 10. Final Response

### Success
```json
{
  "success": true,
  "message": "Form submitted successfully."
}


Error

{
  "success": false,
  "error": "Invalid API Key"
}



📊 Dashboard Overview

The dashboard includes:

Project list

SMTP settings

Allowed domains

API key regeneration

Submission logs

Spam logs

Analytics charts (daily/weekly/monthly)

Accessed via JWT authentication.



🌐 System Architecture (Summary)

Client Website → Submission API → Validation → Spam Filters → Sanitization →
SMTP Mailer → Logs DB → API Response → Dashboard (Admin UI)


✔ Key Benefits

Secure form handling

No backend required for client websites

Fully self-hosted

Scalable multi-project system

Per-project SMTP customization

Strong spam protection

Centralized logs & analytics



📌 Future Enhancements (optional)

Webhooks for forwarding submission data

File upload support

Domain-level rate limiting

Project SMTP health monitoring

API request analytics