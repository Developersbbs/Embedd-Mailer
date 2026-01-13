# Embedd UI Style Guide

This document defines the UI and styling conventions used in this codebase. It is intended to help you build new screens and components that look and behave consistently with the existing Embedd product.

---

## 1) Styling stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 (note `app/globals.css` uses `@import "tailwindcss"`)
- **Animations**:
  - `tw-animate-css` (imported globally)
  - `framer-motion` (used heavily on landing components)
- **Component system**: shadcn/ui (New York preset)
  - Uses Radix UI primitives under the hood
  - Uses `class-variance-authority` (`cva`) for variants
- **Class composition**: `cn()` helper (`lib/utils.ts`) wraps `clsx` + `tailwind-merge`

---

## 2) Theming & tokens

### 2.1 Theme switching

- Theme provider: `components/theme-provider.tsx` (`next-themes`)
- The theme is applied by toggling the `.dark` class.

### 2.2 Design tokens

The project is **CSS-variable driven**. Most UI classes should rely on tokenized Tailwind utilities that map to CSS variables:

- Backgrounds: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-accent`
- Text: `text-foreground`, `text-muted-foreground`, `text-card-foreground`
- Borders: `border-border`, `border-input`
- Ring/focus: `ring-ring`, `outline-ring/50`
- Semantic: `bg-primary`, `bg-secondary`, `bg-destructive`

These tokens are defined in `app/globals.css` using OKLCH values.

### 2.3 Color system (semantic)

Use semantic intent over hard-coded colors.

- **Primary**: `bg-primary` / `text-primary`
- **Secondary**: `bg-secondary` / `text-secondary-foreground`
- **Muted**: `bg-muted` / `text-muted-foreground`
- **Accent**: `bg-accent` / `text-accent-foreground`
- **Destructive**: `bg-destructive` / `text-destructive`

Allowed direct colors (sparingly): status emphasis such as `text-green-500` for success indicators in dashboards/marketing.

### 2.4 Radius

Radius is tokenized and relatively “soft”:

- Base radius: `--radius: 1.3rem`
- Prefer Tailwind radius utilities from components (`rounded-md`, `rounded-lg`, `rounded-xl`) or shadcn defaults.

### 2.5 Shadows

Shadows are used for elevation and “glass” UI on the landing page:

- Common: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`
- Marketing glow patterns:
  - `shadow-primary/20`, `shadow-primary/30` (accented glow)
  - blurred glow layers: `bg-primary/20 blur-3xl`

---

## 3) Typography

### 3.1 Fonts

- Root layout loads Google fonts in `app/layout.tsx`:
  - Geist (sans)
  - Geist Mono
  - Audiowide

Global theme variables in `app/globals.css` include:

- `--font-sans: Open Sans, sans-serif;`
- `--font-mono: Menlo, monospace;`

Practical guidance:

- Use `font-mono` sparingly for logs, timestamps, keys, code-like values.
- Use `tracking-tight` for headings.

### 3.2 Heading scale

Typical heading patterns in the repo:

- Page titles: `text-2xl font-bold tracking-tight` or `text-3xl font-bold tracking-tight`
- Marketing hero: `text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight`
- Section titles: `text-3xl md:text-5xl font-bold tracking-tight`

### 3.3 Body text

- Default body: `text-sm` or `text-base`
- Secondary/help text: `text-muted-foreground` + `text-sm`

---

## 4) Layout & spacing

### 4.1 Containers

The codebase uses the Tailwind `container` utility frequently:

- Marketing sections: `container mx-auto px-4`
- Dashboard pages: `ContentLayout` uses `container pt-8 pb-8 px-4 sm:px-8 mx-auto`

Guidelines:

- Use `container` for content width control.
- Use `max-w-*` for narrower reading widths inside the container (e.g. `max-w-2xl`).

### 4.2 Spacing rhythm

Common section spacing:

- Marketing vertical rhythm: `py-24` per section
- Dashboard padding: `p-4 md:p-8 pt-6` (tutorials) or `pt-8 pb-8`

Prefer:

- `space-y-*` for vertical stacks
- `gap-*` in flex/grid

### 4.3 Dashboard shell

- Sidebar is fixed and width toggles between `w-[90px]` and `w-72`.
- Main content shifts with `lg:ml-[90px]` or `lg:ml-72`.

### 4.4 Responsive breakpoints

- `sm` for modest layout changes
- `md` for multi-column in marketing (`md:grid-cols-2`)
- `lg` for dashboard shell changes & larger grids

---

## 5) Components (shadcn/ui conventions)

### 5.1 `cn()` and class merging

Always compose classes with `cn()` when building components.

- Utility: `lib/utils.ts`

### 5.2 Buttons

Use `components/ui/button.tsx`.

Variants:

- `default` (primary)
- `secondary`
- `outline`
- `ghost`
- `link`
- `destructive`

Sizes:

- `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`

Common patterns in repo:

- CTA pill buttons: `rounded-full px-8 h-12` (marketing)
- Icon toggles: `variant="outline" size="icon"`

### 5.3 Cards

Use `components/ui/card.tsx`.

- Default: `rounded-xl border py-6 shadow-sm`
- Marketing glass style often adds:
  - `bg-card/80 backdrop-blur-md border-primary/10`

### 5.4 Inputs

Use `components/ui/input.tsx`.

- Uses ring-based focus styles
- Supports `aria-invalid` styling

### 5.5 Forms

For forms built with React Hook Form:

- Use `components/ui/form.tsx` helpers (`FormField`, `FormItem`, `FormLabel`, `FormControl`, etc.)
- Pair with `Field` primitives (`components/ui/field.tsx`) where appropriate

### 5.6 Tables

Use `components/ui/table.tsx`.

- Rows use hover state: `hover:bg-muted/50`

### 5.7 Empty states

Use `components/ui/empty.tsx`.

- Standard: dashed border + centered content

---

## 6) Interaction & motion

### 6.1 Focus & accessibility

- Prefer built-in shadcn focus styles:
  - `focus-visible:ring-[3px] focus-visible:ring-ring/50`
- Always include accessible labels:
  - Visible label via `Label` / `FormLabel`, or
  - `sr-only` when visual label is not desired

### 6.2 Hover/active states

Common patterns:

- Subtle hover background: `hover:bg-muted/50` or `hover:bg-accent`
- Border emphasis on hover: `hover:border-primary/20` or `hover:border-primary/50`

### 6.3 Motion on marketing

Marketing components (e.g. `Hero`, `WebFeatureGrid`) use `framer-motion`:

- Entrance: fade + translate (`opacity`, `y`)
- Hover lift: `whileHover={{ y: -5 }}`

Guideline:

- Keep motion purposeful (feedback or hierarchy), not decorative-only.

---

## 7) Iconography

- Default icon library: **Lucide** (`components.json`)
- Common size: `h-4 w-4` inside buttons

Guidelines:

- Keep icons aligned with text via `gap-2`.
- Use `size="icon"` buttons for icon-only actions.

---

## 8) Copy & content styling

- Use `text-muted-foreground` for helper text.
- Use `font-mono` for:
  - API keys
  - timestamps
  - code snippets

Code blocks/snippets (UI):

- Use `bg-muted p-4 rounded-md overflow-x-auto text-sm` (seen in tutorials).

---

## 9) Do / Don’t

### Do

- Use semantic tokens: `bg-background`, `text-foreground`, `border-border`.
- Use shadcn primitives from `components/ui/*`.
- Use `cn()` for composing Tailwind class strings.
- Keep spacing consistent: prefer `py-24` sections on marketing and container-based page padding.

### Don’t

- Don’t hard-code colors unless needed for status emphasis.
- Don’t introduce new component patterns when an existing one exists (`Card`, `Button`, `Empty`).
- Don’t add global CSS for one-off styling; prefer component-local Tailwind.

---

## 10) Reference: key files

- `app/globals.css` — theme tokens (OKLCH), dark mode values, base layer
- `tailwind.config.js` — content scanning and small theme extensions
- `components.json` — shadcn config (New York, CSS variables enabled)
- `components/ui/*` — canonical UI building blocks
- `components/admin-panel/*` — dashboard shell patterns
- `components/landing/*` — marketing patterns (glass + glow + motion)
