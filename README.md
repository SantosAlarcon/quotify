# Quotify

**Create stunning social media quote images in seconds.** Pick a layout, customize every detail, export to PNG.

> ⚡ Built with [Waku](https://waku.gg) — React 19, Zustand, modern CSS. No Tailwind, no i18n dependencies, no fluff.

![](https://github.com/SantosAlarcon/quotify/blob/master/public/images/Screenshot.webp)
---

This README is also available in [spanish](https://github.com/SantosAlarcon/quotify/blob/master/README-es.md) language.

## Features
| Feature | Description |
|---|---|
| **7 layouts** | Classic, Modern, Bold Quote, Minimal, Centered, Split, Gradient |
| **4 aspect ratios** | Square (1:1), Portrait (4:5), OG (1.91:1), Story (9:16) |
| **Typography** | 15 fonts (Google Fonts + system) + upload your own `.woff2/.ttf/.otf` |
| **Colors** | Accent color, background (solid or **16 gradients**), text color |
| **Markdown** | **bold**, *italic*, `code`, [links](url), lists, blockquotes |
| **Images** | Upload profile photo and logo (with opacity and position controls) |
| **Export** | PNG at full resolution |
| **13 templates** | One-click preset styles to jumpstart your design |
| **Dark mode** | Auto (system) + manual toggle: Light / Dark / System |
| **Languages** | 11 locales — EN, ES, CA, FR, PT, DE, JA, IT, KO, ZH-CN, ZH-TW |
| **Persistence** | Everything auto-saves to localStorage |
| **Import / Export** | Save and load your config as JSON |
| **PWA** | Installable, works offline with service worker |
| **Accessibility** | Keyboard navigation, `aria-pressed`, `aria-live`, contrast |
| **Responsive** | Desktop (two panels) and mobile (vertical flow) |

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [Waku](https://waku.gg) (RSC-based) + Vite |
| UI | React 19 + React Compiler |
| State | Zustand with `persist` |
| CSS | Modern CSS — `light-dark()`, CSS Nesting, implicit layers, `svh` |
| Typography | Google Fonts via CSS + dynamic `@font-face` for local fonts |
| Export | `html-to-image` → PNG / SVG |
| Markdown | `marked` + `dompurify` |
| i18n | **Zero dependencies** — flat JSON + Zustand + browser detection |
| TypeScript | Strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |

---

## Getting Started

```bash
git clone https://github.com/youruser/quotify
cd quotify
npm install
npm run dev
```

Open `http://localhost:3000` and start creating.

### Commands

```bash
npm run dev       # Development
npm run build     # Production build
npm run start     # Serve build
```

---

## Architecture

```
src/
├── components/     # React components (client components with 'use client')
├── i18n/
│   ├── locales/    # 11 JSON translation files
│   ├── types.ts    # Types and supported locales
│   └── use-translations.ts  # useTranslations hook with fallback chain
├── lib/
│   ├── fonts.ts         # Font catalog with metadata
│   └── use-font-loader.ts  # Dynamic font loading (Google Fonts + @font-face)
├── middleware/     # Hono middleware (no trailing slash)
├── pages/
│   ├── _layout.tsx # Server layout component
│   └── index.tsx   # Server home page
├── store/
│   ├── quote-store.ts  # Editor state (persist)
│   └── i18n-store.ts   # Locale state (persist)
└── styles/
    ├── reset.css
    ├── variables.css
    ├── layout.css
    ├── typography.css
    ├── fonts.css
    └── components/   # Per-component styles
```

Key pattern: **server components** for layout/pages, **client components** for everything interactive. Zustand state hydrates from `localStorage` on the client.

---

## i18n

Automatic browser language detection. Switch manually from the header selector. Preference persists to `localStorage`.

Translations use a nested flat key structure:
```
editor.labels.quoteText → "Quote text"
editor.buttons.resetAll → "Reset all"
```

Interpolation supported via `{n}`, `{name}`, `{fontName}`, `{label}` placeholders.

---

## Roadmap

- [ ] More layout presets
- [x] SVG export
- [x] 13 built-in templates
- [x] Forced dark mode toggle
- [x] PWA for offline use
- [ ] Community template gallery

---

## License

MIT
