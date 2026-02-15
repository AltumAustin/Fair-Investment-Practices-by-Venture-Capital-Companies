# VC Comply Brand Guidelines

**VC Comply** — Venture Capital Demographic Compliance, Simplified

VC Comply helps venture capital firms comply with California's Fair Investment Practices by Venture Capital Companies Law (Corp. Code, § 27500 et seq.). It distributes demographic data surveys to startup founders, collects responses, and generates annual reports for the DFPI.

---

## Color Palette

### Primary Colors

| Name        | Hex       | RGB              | HSL                | Usage                          |
| ----------- | --------- | ---------------- | ------------------ | ------------------------------ |
| Navy        | `#1B365D` | `rgb(27, 54, 93)` | `hsl(215, 55%, 24%)` | Primary brand, text, icons     |
| Teal        | `#22B8CF` | `rgb(34, 184, 207)` | `hsl(188, 72%, 47%)` | Accent, CTAs, highlights       |

### Neutral Colors

| Name        | Hex       | RGB                | HSL                  | Usage                          |
| ----------- | --------- | ------------------ | -------------------- | ------------------------------ |
| Midnight    | `#0A1628` | `rgb(10, 22, 40)`  | `hsl(216, 60%, 10%)` | Dark backgrounds               |
| Dark Slate  | `#1E293B` | `rgb(30, 41, 59)`  | `hsl(217, 33%, 17%)` | Headings, primary text         |
| Slate       | `#64748B` | `rgb(100, 116, 139)` | `hsl(215, 16%, 47%)` | Secondary text, muted elements |
| Border      | `#E2E8F0` | `rgb(226, 232, 240)` | `hsl(214, 32%, 91%)` | Borders, dividers              |
| Background  | `#F8FAFC` | `rgb(248, 250, 252)` | `hsl(210, 40%, 98%)` | Page background                |
| White       | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)`  | Cards, surfaces                |

---

## Icon

The VC Comply icon is a 2x2 grid of circles: three in navy and one in teal with a white checkmark. It represents demographic data points (founders) converging into a single compliance verification.

### Design Principles

- **Simple** — Four circles and a checkmark. Reads clearly at any size.
- **Meaningful** — Data points (circles) + compliance (check) = the product's purpose.
- **Distinctive** — The asymmetric color break avoids confusion with generic grid icons.

### Usage Rules

- **Minimum size:** 16x16 px (favicon) or 12x12 pt (print)
- **Clear space:** Maintain padding equal to 25% of the icon width on all sides
- **Do not** rotate, skew, recolor individual circles, add drop shadows, or place over busy backgrounds without sufficient contrast
- **Backgrounds:** Use the full-color icon on light backgrounds. Use `icon-mono-white.svg` on dark backgrounds. For the apple touch icon, the navy background with white/teal variant is pre-generated.

---

## Logo Lockups

Two lockups are provided, each in light-background and dark-background variants:

- **Horizontal:** Icon + "VC Comply" side by side. Use in headers, navigation bars, and horizontal layouts.
- **Stacked:** Icon above "VC Comply." Use in splash screens, centered layouts, and square contexts.

The wordmark uses [Inter](https://rsms.me/inter/) (SemiBold, 600 weight), embedded as SVG paths for zero font dependencies.

---

## CSS Variables

Ready to paste into `globals.css` or a Tailwind config:

```css
:root {
  /* Brand */
  --color-primary: #1B365D;
  --color-accent: #22B8CF;

  /* Neutrals */
  --color-midnight: #0A1628;
  --color-text: #1E293B;
  --color-muted: #64748B;
  --color-border: #E2E8F0;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
}
```

### Tailwind Config Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1B365D',
          teal: '#22B8CF',
          midnight: '#0A1628',
        },
      },
    },
  },
};
```

---

## File Manifest

```
brand/
  BRAND.md                              — This file
  generate_assets.py                    — Python script to regenerate all assets

  icon/
    icon.svg                            — Master icon (square, 512x512 default, vector)
    icon-mono-black.svg                 — Monochrome black version
    icon-mono-white.svg                 — Monochrome white (reversed) version

  favicon/
    favicon.svg                         — Scalable vector favicon
    favicon.ico                         — Multi-resolution ICO (16, 32, 48)
    favicon-16x16.png                   — 16x16 PNG favicon
    favicon-32x32.png                   — 32x32 PNG favicon
    apple-touch-icon.png                — 180x180 with navy background + white/teal icon
    android-chrome-192x192.png          — Android/PWA icon (192x192)
    android-chrome-512x512.png          — Android/PWA icon (512x512)
    site.webmanifest                    — Web app manifest referencing Android icons

  logo/
    logo-horizontal-color.svg           — Horizontal lockup for light backgrounds
    logo-horizontal-dark.svg            — Horizontal lockup for dark backgrounds
    logo-stacked-color.svg              — Stacked lockup for light backgrounds
    logo-stacked-dark.svg               — Stacked lockup for dark backgrounds

  social/
    og-image.png                        — Open Graph preview image (1200x630)
```

---

## HTML Snippet

Add to your `<head>` to wire up favicons:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#1B365D" />
```

Open Graph / social meta tags:

```html
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:title" content="VC Comply" />
<meta property="og:description" content="Venture Capital Demographic Compliance, Simplified" />
```
