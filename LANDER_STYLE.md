# Embedd Landing Page Style Guide (Lander)

This guide documents the **marketing/landing page** styling conventions used in `components/landing/*` and `app/page.tsx`.

It is intentionally separate from the dashboard/admin UI guidelines.

---

## 1) Lander design goals

- **Security + modern** vibe: clean typography, high contrast, and restrained neon/glow.
- **Glass + glow**: translucent surfaces (`bg-card/..` + `backdrop-blur`) layered over subtle gradient/light effects.
- **Motion-forward** but not distracting: small entrance animations, gentle hover lifts.

---

## 2) Page structure & spacing

### 2.1 Global layout

- Landing page is composed in `app/page.tsx` as a vertical stack of sections:
  - `Hero`
  - `SocialProof`
  - `WebFeatureGrid`
  - `Steps`
  - `SecurityHighlight`
  - `AnalyticsPreview`
  - `DeveloperSection`
  - `Pricing`
  - `FAQ`
  - `Footer`

### 2.2 Section spacing

Standard section padding:

- **Major sections**: `py-24`
- **Social proof strip**: `py-12`

Recommended convention:

- Use `py-24` for most sections.
- Keep a consistent section “intro block”:
  - `text-center mb-16`
  - title: `text-3xl md:text-5xl font-bold tracking-tight`
  - subtitle: `text-lg text-muted-foreground`

### 2.3 Width and containers

Use `container mx-auto px-4` for consistent max width and gutters.

Typical max widths:

- Section intro text: `max-w-2xl` / `max-w-3xl`
- Hero container: `max-w-5xl`
- Feature visual: `max-w-3xl`
- FAQ: `max-w-3xl`

---

## 3) Backgrounds & decorative effects

### 3.1 Base background

- Prefer token background utilities:
  - `bg-background`
  - `bg-muted/10` or `bg-muted/20` for subtle section separation

### 3.2 Decorative blobs

Common pattern (see `Steps.tsx`):

- `bg-primary/5 rounded-full blur-3xl`
- `bg-secondary/5 rounded-full blur-3xl`

Guidelines:

- Use **very low opacity** (5–10%)
- Keep blobs behind content: `-z-10`
- Keep them large and soft (e.g. `w-96 h-96 blur-3xl`)

### 3.3 “Light rays” hero effect

`Hero.tsx` uses a `LightRays` component with:

- `className="custom-rays opacity-50 dark:opacity-30"`

Guidelines:

- Avoid adding additional competing backgrounds in the hero.
- Keep hero visuals to a single primary effect + one glass card.

---

## 4) Glass surfaces (cards, headers)

### 4.1 Glass header

`FloatingHeader.tsx` pattern:

- `bg-background/60 backdrop-blur-xl`
- `border border-primary/10`
- `rounded-full`
- `shadow-lg shadow-primary/5`

Recommended:

- Use subtle shadow in light mode and keep it minimal.
- Prefer **rounded-full** for floating nav.

### 4.2 Glass cards

Common “glass card” recipe:

- `bg-card/80` or `bg-card/90`
- `backdrop-blur-md`
- `border-primary/10` or `border-border/50`
- `shadow-2xl`

Example usage:

- `Hero.tsx`: `bg-card/80 backdrop-blur-md border-primary/10 shadow-2xl`
- `SecurityHighlight.tsx`: `bg-card/90 backdrop-blur border-border p-6 shadow-2xl`

---

## 5) Typography (lander)

### 5.1 Hero

- Title: `text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight`
- Emphasis: gradient text using theme tokens:
  - `text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground`

### 5.2 Section headings

- `text-3xl md:text-5xl font-bold tracking-tight`

### 5.3 Supporting copy

- `text-lg text-muted-foreground`

### 5.4 Microcopy / labels

- Use uppercase + tracking for meta labels:
  - `text-xs uppercase tracking-wider font-semibold`

---

## 6) CTA styles

### 6.1 Primary CTA button

- Use shadcn `Button` `variant="default"`.
- Lander customization:
  - `rounded-full`
  - larger padding/height: `px-8 h-12`
  - glow shadow: `shadow-xl shadow-primary/20`

### 6.2 Secondary CTA

- `variant="outline"` for secondary actions.

---

## 7) Motion guidelines (framer-motion)

The lander uses `framer-motion` consistently:

- Entrance patterns:
  - `initial={{ opacity: 0, y: 20 }}`
  - `animate/whileInView={{ opacity: 1, y: 0 }}`
- Staggered delays:
  - `transition={{ delay: index * 0.1 }}`
- Hover lift:
  - `whileHover={{ y: -5 }}` for cards

Rules:

- Keep transitions fast: `duration` ~ 0.3–0.8
- Avoid infinite looping animations except for tiny indicators (e.g. ping dots)

---

## 8) Components & patterns by section

### 8.1 Social proof strip (`SocialProof.tsx`)

- Background: `bg-muted/20` + `border-y border-border/40`
- Logo text uses gradient clipping:
  - `bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground`
- Optional grayscale hover:
  - `grayscale hover:grayscale-0 transition-all`

### 8.2 Feature grid (`WebFeatureGrid.tsx`)

- Grid:
  - `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Card hover:
  - `hover:bg-card hover:border-primary/20 transition-colors`
- Soft gradient overlay on hover:
  - `absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100`

### 8.3 Steps (`Steps.tsx`)

- Step icon tile:
  - `w-24 h-24 rounded-2xl bg-card border border-border shadow-lg`
- Step number badge:
  - `bg-primary text-primary-foreground rounded-full shadow-md`

Note: the code snippet card currently uses **hard-coded dark grays** (`bg-[#1e1e1e]` etc.) to mimic a terminal.

Guideline:

- Keep these hard-coded “terminal” styles localized to the snippet component.

### 8.4 Security highlight (`SecurityHighlight.tsx`)

- Feature label pill:
  - `text-primary bg-primary/10 rounded-full`
- Right-side log card uses:
  - gradient blur border: `bg-gradient-to-r from-primary to-secondary blur opacity-20`
- Status colors:
  - `blocked`: red
  - `quarantined`: yellow
  - `delivered`: green

### 8.5 Analytics preview (`AnalyticsPreview.tsx`)

- Stats cards:
  - `p-6 text-center hover:shadow-lg transition-shadow`
- Status change uses red/green.
- Mini charts are currently mock bars with random heights.

### 8.6 FAQ (`FAQ.tsx`)

- FAQ container card:
  - `bg-card border border-border/50 rounded-2xl p-2 md:p-8 shadow-sm`
- Accordion motion:
  - height animation + fade (AnimatePresence)

---

## 9) Lander-specific do/don’t

### Do

- Use token colors for backgrounds, text, borders.
- Keep section spacing consistent (`py-24`).
- Prefer glass surfaces with low opacity and blur.
- Use small, consistent motion.

### Don’t

- Don’t introduce additional global background effects beyond what the hero already uses.
- Don’t hard-code colors except where intentionally mimicking a terminal UI.
- Don’t mix dashboard spacing/layout patterns into the lander.
