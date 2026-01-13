# Embedd Color Guide

This document describes the **color system** used in this repository.

Embedd uses a **semantic token** approach (shadcn/ui style) powered by **CSS variables** defined in `app/globals.css`.

Use semantic utilities (e.g. `bg-background`, `text-muted-foreground`, `border-border`) instead of hard-coded colors.

---

## 1) Source of truth

- Tokens are defined in:
  - `app/globals.css` under `:root` (light theme) and `.dark` (dark theme)
- The app uses `next-themes` and toggles the `.dark` class.

---

## 2) Semantic tokens (what to use in code)

### 2.1 Surfaces

- **Page background**: `bg-background`
- **Card surface**: `bg-card`
- **Popover surface**: `bg-popover`
- **Muted surface** (subtle section blocks): `bg-muted`
- **Accent surface** (hover/selected): `bg-accent`

### 2.2 Text

- **Primary text**: `text-foreground`
- **Secondary/help text**: `text-muted-foreground`
- **On card**: `text-card-foreground`
- **On popover**: `text-popover-foreground`

### 2.3 Borders & inputs

- **Default border**: `border-border`
- **Input border**: `border-input`
- **Focus ring token**: `ring-ring` and/or `outline-ring/50`

### 2.4 Brand & actions

- **Primary action**:
  - `bg-primary text-primary-foreground`
  - hover: `hover:bg-primary/90`
- **Secondary action**:
  - `bg-secondary text-secondary-foreground`
- **Destructive**:
  - `bg-destructive text-destructive-foreground`

### 2.5 Sidebar tokens

- `bg-sidebar`, `text-sidebar-foreground`
- `bg-sidebar-primary`, `text-sidebar-primary-foreground`
- `bg-sidebar-accent`, `text-sidebar-accent-foreground`
- `border-sidebar-border`, `ring-sidebar-ring`

### 2.6 Chart tokens

Used for analytics/visuals:

- `--chart-1` .. `--chart-5`

---

## 3) Light theme palette (from `:root`)

These are the raw values used by the semantic tokens.

### 3.1 Core surfaces

- `--background`: `oklch(1.0000 0 0)`
- `--foreground`: `oklch(0.1884 0.0128 248.5103)`
- `--card`: `oklch(0.9784 0.0011 197.1387)`
- `--card-foreground`: `oklch(0.1884 0.0128 248.5103)`
- `--popover`: `oklch(1.0000 0 0)`
- `--popover-foreground`: `oklch(0.1884 0.0128 248.5103)`

### 3.2 Brand / emphasis

- `--primary`: `oklch(0.6723 0.1606 244.9955)`
- `--primary-foreground`: `oklch(1.0000 0 0)`
- `--accent`: `oklch(0.9392 0.0166 250.8453)`
- `--accent-foreground`: `oklch(0.6723 0.1606 244.9955)`

### 3.3 Supporting surfaces

- `--secondary`: `oklch(0.1884 0.0128 248.5103)`
- `--secondary-foreground`: `oklch(1.0000 0 0)`
- `--muted`: `oklch(0.9222 0.0013 286.3737)`
- `--muted-foreground`: `oklch(0.1884 0.0128 248.5103)`

### 3.4 Inputs & outlines

- `--border`: `oklch(0.9317 0.0118 231.6594)`
- `--input`: `oklch(0.9809 0.0025 228.7836)`
- `--ring`: `oklch(0.6818 0.1584 243.3540)`

### 3.5 Destructive

- `--destructive`: `oklch(0.6188 0.2376 25.7658)`
- `--destructive-foreground`: `oklch(1.0000 0 0)`

### 3.6 Charts

- `--chart-1`: `oklch(0.6723 0.1606 244.9955)`
- `--chart-2`: `oklch(0.6907 0.1554 160.3454)`
- `--chart-3`: `oklch(0.8214 0.1600 82.5337)`
- `--chart-4`: `oklch(0.7064 0.1822 151.7125)`
- `--chart-5`: `oklch(0.5919 0.2186 10.5826)`

### 3.7 Sidebar

- `--sidebar`: `oklch(0.9784 0.0011 197.1387)`
- `--sidebar-foreground`: `oklch(0.1884 0.0128 248.5103)`
- `--sidebar-primary`: `oklch(0.6723 0.1606 244.9955)`
- `--sidebar-primary-foreground`: `oklch(1.0000 0 0)`
- `--sidebar-accent`: `oklch(0.9392 0.0166 250.8453)`
- `--sidebar-accent-foreground`: `oklch(0.6723 0.1606 244.9955)`
- `--sidebar-border`: `oklch(0.9271 0.0101 238.5177)`
- `--sidebar-ring`: `oklch(0.6818 0.1584 243.3540)`

---

## 4) Dark theme palette (from `.dark`)

### 4.1 Core surfaces

- `--background`: `oklch(0 0 0)`
- `--foreground`: `oklch(0.9328 0.0025 228.7857)`
- `--card`: `oklch(0.2097 0.0080 274.5332)`
- `--card-foreground`: `oklch(0.8853 0 0)`
- `--popover`: `oklch(0 0 0)`
- `--popover-foreground`: `oklch(0.9328 0.0025 228.7857)`

### 4.2 Brand / emphasis

- `--primary`: `oklch(0.6692 0.1607 245.0110)`
- `--primary-foreground`: `oklch(1.0000 0 0)`
- `--accent`: `oklch(0.1928 0.0331 242.5459)`
- `--accent-foreground`: `oklch(0.6692 0.1607 245.0110)`

### 4.3 Supporting surfaces

- `--secondary`: `oklch(0.9622 0.0035 219.5331)`
- `--secondary-foreground`: `oklch(0.1884 0.0128 248.5103)`
- `--muted`: `oklch(0.2090 0 0)`
- `--muted-foreground`: `oklch(0.5637 0.0078 247.9662)`

### 4.4 Inputs & outlines

- `--border`: `oklch(0.2674 0.0047 248.0045)`
- `--input`: `oklch(0.3020 0.0288 244.8244)`
- `--ring`: `oklch(0.6818 0.1584 243.3540)`

### 4.5 Destructive

- `--destructive`: `oklch(0.6188 0.2376 25.7658)`
- `--destructive-foreground`: `oklch(1.0000 0 0)`

### 4.6 Charts

- Same definitions as light theme:
  - `--chart-1`..`--chart-5`

### 4.7 Sidebar

- `--sidebar`: `oklch(0.2097 0.0080 274.5332)`
- `--sidebar-foreground`: `oklch(0.8853 0 0)`
- `--sidebar-primary`: `oklch(0.6818 0.1584 243.3540)`
- `--sidebar-primary-foreground`: `oklch(1.0000 0 0)`
- `--sidebar-accent`: `oklch(0.1928 0.0331 242.5459)`
- `--sidebar-accent-foreground`: `oklch(0.6692 0.1607 245.0110)`
- `--sidebar-border`: `oklch(0.3795 0.0220 240.5943)`
- `--sidebar-ring`: `oklch(0.6818 0.1584 243.3540)`

---

## 5) Practical usage patterns

### 5.1 Lander section backgrounds

- Alternate section background:
  - `bg-background` vs `bg-muted/10` or `bg-muted/20`

### 5.2 Glass surfaces

- Use semantic surfaces with opacity:
  - `bg-card/80` or `bg-background/60`
  - plus `backdrop-blur-*`

### 5.3 Status colors

The landing page occasionally uses non-token status colors:

- success: `text-green-500`
- warning: `text-yellow-500`
- danger: `text-red-500`

Keep these limited to:

- small indicators
- security/traffic logs
- analytics deltas

---

## 6) Notes / inconsistencies to be aware of

- Some marketing snippets intentionally hard-code terminal colors (e.g. `Steps.tsx` uses `bg-[#1e1e1e]`). Keep such hard-coded palettes isolated.
- Some comments in `globals.css` refer to “orange accents”, but the `--primary` hue value is closer to a blue/cyan range. Treat the OKLCH values as authoritative.
