# Embedd – Landing Page Content Draft

This document outlines the content and section structure for the Embedd marketing landing page. The UI will be implemented using **React** + your existing **admin layout** + **shadcn/ui** and **React Bits UI**–style components (cards, stats, steps, timelines, etc.).

---

## 1. Hero Section – "Secure mail, clear signals"

**Layout idea (React Bits style):**
- Single centered hero block using the existing aura background.
- Content vertically stacked and centered: heading, subheading, CTAs, and a compact visual.
- On larger screens, limit width with a max-width container so text stays readable.

**Content**

**Headline**  
`Secure email infrastructure with real‑time spam intelligence`

**Subheadline**  
`Embedd helps teams send transactional emails safely, track delivery, and block threats before they reach inboxes.`

**Primary CTA**  
- Label: `Start for free`
- Subtext (small text below button): `No credit card required. Connect your SMTP in minutes.`

**Secondary CTA**  
- Label: `View live demo`
- Opens a read-only workspace or demo project.

**Visual ideas (inside the centered hero)**
- Below the CTAs, render a single, wide `Card` with a soft blur/outline to sit on top of the aura background.
- Inside that card:
  - A tiny "Today" stats pill: `128 emails • 98.4% delivered`.
  - A slim mini bar chart strip (React Bits chart) showing last 7 days.
  - A single log row: `delivered • New signup confirmation • user@domain.com`.
  - A small badge chip aligned to the right: `Spam blocked • 842 in 24h`.

---

## 2. Social proof strip

**Goal:** instantly show trust and context.

**Content ideas**

- Text: `Trusted by security‑minded teams and indie builders.`
- Row of monochrome logos or placeholder badges:
  - `Startup Labs`
  - `Fintech Core`
  - `DevOps Studio`
  - `SBBS Internal`

Use a subtle `Muted` background and `React Bits`-style `Badge` components.

---

## 3. Feature grid – "Built for secure form handling"

**Layout:** 3 or 4 cards in a responsive grid.

Use `Card`, `CardHeader`, `CardTitle`, `CardDescription` with small React Bits icons.

**Feature 1 – Real‑time spam & threat filtering**
- Title: `Real‑time spam and threat filtering`
- Description: `Automatically detect suspicious submissions, honeypots, and bad domains before email is even sent.`
- Bullets:
  - `Honeypot field detection`
  - `Domain allow‑lists`
  - `IP, user agent and origin checks`

**Feature 2 – SMTP in minutes**
- Title: `Connect any SMTP in minutes`
- Description: `Bring your own SMTP provider—Postmark, SES, custom relays—and manage everything in a single dashboard.`
- Bullets:
  - `Per‑project SMTP configuration`
  - `Zero‑code form endpoint`
  - `JSON, HTML and text payloads`

**Feature 3 – Per‑project dashboards`
- Title: `Per‑project dashboards`
- Description: `Every project gets its own overview: delivery, bounces, spam blocks and recent activity logs.`
- Bullets:
  - `24h and 7‑day trends`
  - `Security & spam widgets`
  - `Per‑project API keys`

**Feature 4 – Developer‑first API (optional)**
- Title: `Developer‑first API`
- Description: `Drop‑in endpoints for forms and programmatic triggers, with clean TypeScript types.`
- Bullets:
  - `REST endpoints for submissions`
  - `Typed SDK (planned)`
  - `CLI for local testing (planned)`

---

## 4. Guided flow section – "How it works"

Use a **3-step React Bits steps component** with icons.

**Step 1 – Create a secure project**
- Text: `Create a project, copy your API key and choose how you want to send: SMTP or provider.`

**Step 2 – Drop in the form endpoint**
- Text: `Point your form to Embedd. We validate, sanitize and run spam checks on every submission.`

**Step 3 – Review logs & alerts**
- Text: `Track deliveries, blocked attempts and quarantined messages in a single security‑first dashboard.`

Below the steps, include a compact **code snippet card**:

```ts
POST https://embedd.sbbs.co.in/api/forms/{projectId}/submit
Headers: {
  "Content-Type": "application/json",
  "X-API-Key": "proj_xxx..."
}
{
  "email": "user@example.com",
  "message": "Hello from SBBS"
}
```

---

## 5. Security & observability highlight

Use a split layout: left text, right a **React Bits timeline / activity list**.

**Left copy**
- Title: `Security signals, not just send status`
- Text: `See blocked attempts, threats and quarantined messages, so your team can respond instead of guessing.`
- Bullets:
  - `Spam & threat counts per project`
  - `Quarantine queue for suspicious messages`
  - `Per‑event metadata: IP, domain, transport response`

**Right visual**
- A vertical `Timeline` or `ActivityList` component with entries like:
  - `Blocked • Signup from throwaway domain`
  - `Delivered • Password reset to user@company.com`
  - `Quarantined • High‑risk link detected in contact form`

---

## 6. Analytics preview section – "Know what’s happening across projects"

Show a **React Bits stats + mini chart** layout.

**Text**
- Title: `Project‑level analytics at a glance`
- Description: `Each project surfaces email volume, delivery rates, spam blocked and threat activity, powered by live mail logs.`

**Stats row**
- `98.4%` – Delivery rate (24h)
- `842` – Spam blocked (24h)
- `63` – Quarantined messages
- `32` – Errors last 24h

**Mini charts**
- Simple area/line charts for:
  - `Daily sends`
  - `Spam vs clean traffic`

---

## 7. For developers section

Use a two-column layout:
- Left: copy + bullets.
- Right: `Tabs` component with `cURL`, `React`, `Next.js` code samples.

**Copy**
- Title: `Built for developers`
- Body: `Embedd plugs into your existing stack with minimal friction. Use simple HTTP endpoints, clean TypeScript types and clear error responses.`

**Bullets**
- `Next.js route examples`
- `Copy‑paste React form snippet`
- `Webhook‑ready log events (planned)`

Tabs content examples (high-level):
- `cURL` POST example.
- `React` using `fetch` on form submit.
- `Next.js` server action example (if you adopt it later).

---

## 8. Pricing / callout section

Keep it simple for now.

**Title**: `Start free, scale when you’re ready`

**Plan ideas**
- Free tier card:
  - `10,000 events / month`
  - `All core features`
  - `Basic logging`
- Pro tier (placeholder):
  - `Higher limits`
  - `Priority support`
  - `Advanced retention & exports`

Include a **React Bits pricing card** layout with:
- Plan name
- Price (or `Coming soon` for Pro)
- CTA button: `Get started`

---

## 9. FAQ section

Use an **Accordion** component.

Sample questions:
1. `What is Embedd?`
   - `A security‑focused mail gateway for form submissions and transactional emails.`
2. `Do I have to change my current SMTP provider?`
   - `No. You bring your own SMTP configuration; Embedd sits in front with spam and logging.`
3. `How is spam & abuse handled?`
   - `We inspect IP, user agent, origin and content, and can block or quarantine suspicious messages per project.`
4. `Where is my data stored?`
   - Placeholder answer until infra is finalized.

---

## 10. Final CTA strip

A simple centered call‑to‑action.

**Text**
- Heading: `Ready to secure your email forms?`
- Subtext: `Create your first SBBS project and get a full security dashboard in minutes.`

**Button**
- `Create a project` → `/app` or `/login` depending on auth state.

---

This `lander.md` is the content blueprint. The next step is to translate these sections into React components using your existing design system (admin layout, shadcn/ui, and any React Bits UI primitives you add for charts, stats and steps).
