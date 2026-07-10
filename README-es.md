# Quotify

**Crea imágenes impactantes para redes sociales en segundos.** Elige plantilla, personaliza cada detalle y exporta a PNG.

> ⚡ Hecho con [Waku](https://waku.gg) — React 19, Zustand, CSS moderno. Sin Tailwind, sin dependencias de i18n, sin tonterías.

---

## Características

|Característica| Descripción |
|---|---|
| **4 diseños** | Clásico, Moderno, Cita destacada, Minimalista |
| **4 proporciones** | Cuadrado (1:1), Retrato (4:5), OG (1.91:1), Historia (9:16) |
| **Tipografía** | 15 fuentes (Google Fonts + system) + sube tu propia `.woff2/.ttf/.otf` |
| **Colores** | Color de acento, fondo (sólido o degradado), color de texto |
| **Markdown** | **negrita**, *cursiva*, `código`, [enlaces](url), listas, blockquotes |
| **Imágenes** | Sube foto de perfil y logotipo (con opacidad y posición) |
| **Exportación** | PNG a resolución completa |
| **Idiomas** | 11 idiomas — EN, ES, CA, FR, PT, DE, JA, IT, KO, ZH-CN, ZH-TW |
| **Tema** | Claro / Oscuro automático (`light-dark()`) |
| **Persistencia** | Todo se guarda automáticamente en localStorage |
| **Import / Export** | Guarda y carga tu configuración en JSON |
| **Accesibilidad** | Navegación por teclado, `aria-pressed`, `aria-live`, contraste |
| **Responsive** | Escritorio (dos paneles) y móvil (flujo vertical) |

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Waku](https://waku.gg) (RSC-based) + Vite |
| UI | React 19 + React Compiler |
| Estado | Zustand con `persist` |
| CSS | CSS moderno — `light-dark()`, CSS Nesting, capas implícitas, `svh` |
| Tipografía | Google Fonts via CSS + `@font-face` dinámico para fuentes locales |
| Exportación | `html-to-image` → PNG |
| Markdown | `marked` + `dompurify` |
| i18n | **0 dependencias** — JSON plano + Zustand + detección del navegador |
| TypeScript | Strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |

---

## Getting Started

```bash
git clone https://github.com/tuusuario/quotify
cd quotify
npm install
npm run dev
```

Abre `http://localhost:3000` y empieza a crear.

### Comandos

```bash
npm run dev       # Desarrollo
npm run build     # Build producción
npm run start     # Servir build
```

---

## Arquitectura

```
src/
├── components/     # Componentes React (client components con 'use client')
├── i18n/
│   ├── locales/    # 11 archivos JSON de traducciones
│   ├── types.ts    # Tipos e idiomas soportados
│   └── use-translations.ts  # Hook useTranslations con fallback chain
├── lib/
│   ├── fonts.ts         # Catálogo de fuentes con metadata
│   └── use-font-loader.ts  # Carga dinámica (Google Fonts + @font-face)
├── middleware/     # Hono middleware (sin trailing slash)
├── pages/
│   ├── _layout.tsx # Layout server component
│   └── index.tsx   # Home page server component
├── store/
│   ├── quote-store.ts  # Estado del editor (persist)
│   └── i18n-store.ts   # Estado del idioma (persist)
└── styles/
    ├── reset.css
    ├── variables.css
    ├── layout.css
    ├── typography.css
    ├── fonts.css
    └── components/   # Estilos por componente
```

Patrón clave: **server components** para layout/pages, **client components** para todo lo interactivo. El estado de Zustand se hidrata desde `localStorage` en el cliente.

---

## i18n

Detección automática del idioma del navegador. Se puede cambiar manualmente desde el selector en el header. La preferencia persiste en `localStorage`.

Las traducciones siguen una estructura plana con claves anidadas:
```
editor.labels.quoteText → "Quote text"
editor.buttons.resetAll → "Reset all"
```

Soporte de interpolación con marcadores `{n}`, `{name}`, `{fontName}`, `{label}`.

---

## Lo que aprendí

- **Waku y RSC**: Cómo conviven server components con estado de cliente. Los hooks de Zustand solo funcionan en `'use client'`, mientras que layout y páginas pueden ser server.
- **CSS moderno**: `light-dark()` elimina la necesidad de media queries para el tema oscuro. CSS Nesting mantiene los estilos limpios y colocalizados.
- **i18n sin dependencias**: JSON + Zustand + un hook es suficiente. No necesitas i18next para 11 idiomas si el proyecto es manejable.
- **Layout sin doble scroll**: `body { display: flex; min-height: 100svh }` + hijo con `flex: 1; min-height: 0` = viewport contenido sin scroll de página.
- **Carga de fuentes**: Google Fonts via `<link>` dinámico, fuentes locales via `@font-face` inline con `data-url`. El estado `isFontReady` evita exportar antes de tiempo.

---

## Roadmap

- [ ] Más presets de diseño
- [ ] Exportación a SVG
- [ ] Galería de plantillas comunitarias
- [ ] Modo oscuro forzado en el selector
- [ ] PWA para usar offline

---

## Licencia

MIT
