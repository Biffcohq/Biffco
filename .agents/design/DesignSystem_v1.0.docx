

**BIFFCO™**

*Trust Infrastructure for Global Value Chains*

**DESIGN SYSTEM**

v1.0 — Inter · JetBrains Mono · Tailwind 4 · shadcn/ui · Tabler Icons

| Este documento es la fuente única de verdad del diseño de BIFFCO. *Define cada token, cada componente, cada patrón de interacción. Cualquier developer o designer que trabaje en BIFFCO lo tiene como primera referencia antes de escribir cualquier línea de CSS.* |
| :---: |

Marzo 2026  ·  Córdoba, Argentina  ·  CONFIDENCIAL — USO INTERNO

# **Índice**

| Sección | Título |
| :---- | :---- |
| 01 | Principios del Design System |
| 02 | Identidad de marca — Logo e Isotipo |
| 03 | Sistema de colores — paleta completa |
| 04 | Tipografía — Inter y JetBrains Mono |
| 05 | Espaciado y Grid |
| 06 | Border radius, sombras y elevación |
| 07 | Iconografía — Tabler Icons |
| 08 | Modo oscuro |
| 09 | Componentes — Botones |
| 10 | Componentes — Inputs y Forms |
| 11 | Componentes — Cards, Badges y Tags |
| 12 | Componentes — Navigation (Sidebar y Topbar) |
| 13 | Componentes — Modales, Drawers y Toasts |
| 14 | Componentes — Tables y Data Display |
| 15 | Componentes de dominio BIFFCO |
| 16 | Motion y animación |
| 17 | Accesibilidad |
| 18 | Tailwind config \+ globals.css completo |
| 19 | Checklist de implementación |

# **01\. Principios del Design System**

El design system de BIFFCO tiene 5 principios. No son aspiracionales — son restricciones concretas que guían cada decisión de diseño e implementación.

| Principio | Qué significa en la práctica |
| :---- | :---- |
| 1 — Tokens, nunca valores hardcodeados | Ningún componente tiene un valor de color, tamaño o sombra hardcodeado. Todo usa variables CSS (--color-primary, \--space-4, etc.). Cambiar el tema dark/light \= cambiar las variables. Si encontrás un \#3A86FF en un componente que no es globals.css, es un bug. |
| 2 — shadcn/ui \+ Radix como base, estilos BIFFCO encima | Usamos shadcn/ui para la estructura y accesibilidad de los componentes (Dialog, Select, Dropdown, etc.). Los estilos visuales (colores, radius, sombras) los sobreescribimos con los tokens de BIFFCO. Nunca modificamos los archivos de shadcn directamente. |
| 3 — Tailwind para spacing y layout, variables CSS para color | Tailwind maneja margin, padding, gap, width, height, flex, grid. Los colores y sombras siempre van a través de variables CSS referenciadas desde Tailwind (bg-\[var(--color-primary)\]). Esto hace posible el dark mode sin duplicar clases. |
| 4 — Tipografía semántica | No existe "texto grande" — existe h1, h2, body-lg, body-sm, caption. Cada nivel tipográfico tiene un propósito. Si querés texto más grande para decoración, es display-xl. Si es para datos críticos, es data-lg. El tamaño comunica jerarquía. |
| 5 — Accesibilidad no es opcional | Radix UI nos da ARIA y keyboard navigation en los componentes base. Nuestro trabajo es no romperlos. Todo color de texto tiene ratio ≥ 4.5:1 contra su fondo. Todos los inputs tienen label visible o aria-label. Todos los iconos interactivos tienen aria-label. |

# **02\. Identidad de marca — Logo e Isotipo**

|  | El logo y el isotipo no fueron adjuntados al momento de generar este documento. Esta sección tiene los placeholders con las especificaciones de uso. Reemplazar con los archivos SVG reales antes de publicar. |
| :---- | :---- |

## **Especificaciones de uso — Logo horizontal**

| Contexto | Versión | Fondo | Tamaño mínimo |
| :---- | :---- | :---- | :---- |
| apps/web — Header de marketing | Logo completo \+ wordmark | Blanco o navy (\#0B132B) | 120px de ancho |
| apps/platform — Sidebar colapsado | Isotipo solo | Navy (\#0B132B) o blanco | 32px × 32px |
| apps/platform — Sidebar expandido | Logo completo | Navy (\#0B132B) | 100px de ancho |
| apps/verify — Header público | Isotipo \+ wordmark pequeño | Blanco | 88px de ancho |
| Emails transaccionales (Resend) | Logo completo | Blanco | 140px de ancho |
| Asset Passport PDF | Logo completo en escala de grises | Blanco | 100px de ancho |

## **Zona de exclusión y mal uso**

* Zona de exclusión: 1× la altura del isotipo en todos los lados. Nunca colocar elementos a menos distancia.

* No estirar ni deformar el logo.

* No cambiar los colores del logo (solo las versiones aprobadas: color, blanco, negro).

* No agregar sombras, gradientes ni efectos al logo.

* No usar el logo sobre un fondo con poco contraste (verificar ratio ≥ 4.5:1).

* No usar el wordmark solo sin el isotipo — o van juntos o va el isotipo solo.

## **Archivos del logo (agregar cuando estén disponibles)**

| Archivo | Formato | Uso |
| :---- | :---- | :---- |
| biffco-logo-color.svg | SVG | Web — fondo blanco o claro |
| biffco-logo-white.svg | SVG | Web — fondo oscuro (navy) |
| biffco-iso-color.svg | SVG | Favicon, sidebar colapsado, icono de app |
| biffco-logo-color.png | PNG 2× (400px mínimo) | Emails y documentos donde SVG no es posible |
| biffco-logo-black.svg | SVG | Impresión en escala de grises |

# **03\. Sistema de colores — paleta completa**

BIFFCO usa un sistema de colores semántico. Los colores tienen nombres que comunican su propósito (--color-primary, \--color-error) no sus valores visuales. Esto hace posible cambiar la paleta completa cambiando una variable.

## **Paleta principal**

| Navy `#0B132B` | TAILWIND `navy` | Color de marca principal. Fondos de sidebar, headers de secciones clave, texto en headlines sobre fondo blanco. |
| :---- | :---- | :---- |

| Primary / Blue `#3A86FF` | TAILWIND `primary-/ blue` | Color de acción principal. Botones primarios, links activos, focus rings, highlights de selección. |
| :---- | :---- | :---- |

| Primary Hover `#2563EB` | TAILWIND `primary-hover` | Estado hover del Primary. Nunca usar como color base — solo en :hover o :focus. |
| :---- | :---- | :---- |

| Orange / Accent `#FF6B35` | TAILWIND `orange-/ accent` | Color de acento. Fases del roadmap, highlights secundarios, badges de categoría. |
| :---- | :---- | :---- |

| Success / Green `#059669` | TAILWIND `success-/ green` | Estados de éxito. Firma verificada (SignatureBadge ✓), EUDR Compliant, procesos completados. |
| :---- | :---- | :---- |

| Warning / Amber `#D97706` | TAILWIND `warning-/ amber` | Advertencias. EUDR pendiente, datos próximos a vencer, validaciones soft. |
| :---- | :---- | :---- |

| Error / Red `#DC2626` | TAILWIND `error-/ red` | Errores críticos. Firma inválida (SignatureBadge ✗), holds activos, validaciones bloqueantes. |
| :---- | :---- | :---- |

| Teal `#0D9488` | TAILWIND `teal` | Elementos de verificación y blockchain. BlockchainAnchorBadge, estados verificados en verify.biffco.co. |
| :---- | :---- | :---- |

| Purple `#5A189A` | TAILWIND `purple` | Elementos de auditoría y compliance. ExternalAuditor, badges de compliance, Verification Layer. |
| :---- | :---- | :---- |

## **Colores de texto**

| Text Primary `#0F1623` | TAILWIND `text-primary` | Texto de cuerpo principal, labels, valores en tablas. |
| :---- | :---- | :---- |

| Text Secondary `#6B7280` | TAILWIND `text-secondary` | Texto secundario, subtítulos, metadatos, placeholders. |
| :---- | :---- | :---- |

| Text Muted `#9CA3AF` | TAILWIND `text-muted` | Texto deshabilitado, captions, texto de ayuda. |
| :---- | :---- | :---- |

## **Colores de superficie**

| Surface `#FFFFFF` | TAILWIND `surface` | Fondo de cards, modales, dropdowns en light mode. |
| :---- | :---- | :---- |

| Surface Raised `#F9FAFB` | TAILWIND `surface-raised` | Fondo de tablas (filas alternas), input backgrounds, tooltips. |
| :---- | :---- | :---- |

| Surface Overlay `#F3F4F6` | TAILWIND `surface-overlay` | Hover states de filas, background de código inline. |
| :---- | :---- | :---- |

| Border `#E5E7EB` | TAILWIND `border` | Bordes de cards, separadores, inputs en reposo. |
| :---- | :---- | :---- |

| Border Strong `#D1D5DB` | TAILWIND `border-strong` | Bordes de inputs en focus, divisores prominentes. |
| :---- | :---- | :---- |

## **Colores de fondo semánticos (tinted)**

| Bg Success `#DEFFD6` | TAILWIND `bg-success` | Fondo de callouts de éxito, SignatureBadge ✓, DDS válido. |
| :---- | :---- | :---- |

| Bg Error `#FFF5F5` | TAILWIND `bg-error` | Fondo de callouts de error, SignatureBadge ✗, holds críticos. |
| :---- | :---- | :---- |

| Bg Warning `#FFFBEB` | TAILWIND `bg-warning` | Fondo de warnings, EUDR pendiente, advertencias. |
| :---- | :---- | :---- |

| Bg Info / Blue `#D6EAFF` | TAILWIND `bg-info / blue` | Fondo de callouts informativos, tips, novedades. |
| :---- | :---- | :---- |

| Bg Mint `#F0FDF4` | TAILWIND `bg-mint` | Fondo de ejemplos, exBox en la documentación. |
| :---- | :---- | :---- |

## **Variables CSS — todos los colores del sistema**

| `css` | `/* globals.css — BIFFCO Color System */` `:root {`   `/* ─── Marca ───────────────────────────────── */`   `--color-navy:            #0B132B;`   `--color-primary:         #3A86FF;`   `--color-primary-hover:   #2563EB;`   `--color-primary-subtle:  #D6EAFF;`   `--color-orange:          #FF6B35;`   `--color-teal:            #0D9488;`   `--color-purple:          #5A189A;`   `/* ─── Semánticos ───────────────────────────── */`   `--color-success:         #059669;`   `--color-success-subtle:  #DEFFD6;`   `--color-warning:         #D97706;`   `--color-warning-subtle:  #FFFBEB;`   `--color-error:           #DC2626;`   `--color-error-subtle:    #FFF5F5;`   `/* ─── Texto ────────────────────────────────── */`   `--color-text-primary:    #0F1623;`   `--color-text-secondary:  #6B7280;`   `--color-text-muted:      #9CA3AF;`   `--color-text-inverse:    #FFFFFF;`   `/* ─── Superficies ──────────────────────────── */`   `--color-surface:         #FFFFFF;`   `--color-surface-raised:  #F9FAFB;`   `--color-surface-overlay: #F3F4F6;`   `--color-border:          #E5E7EB;`   `--color-border-strong:   #D1D5DB;`   `/* ─── Background general ───────────────────── */`   `--color-bg:              #F9FAFB;` `}` |
| :---: | :---- |

# **04\. Tipografía — Inter y JetBrains Mono**

BIFFCO usa exactamente dos typefaces. Inter para todo el texto de interfaz y cuerpo. JetBrains Mono para datos técnicos: hashes, claves públicas, EIDs, txHash, código. No se usan otras fuentes.

## **Inter — la tipografía principal**

Inter Variable. Cargada via next/font para evitar FOUT y garantizar subset correcto. Nunca cargarla de Google Fonts en producción.

| `ts` | `// apps/platform/src/app/layout.tsx` `import { Inter } from 'next/font/google'` `const inter = Inter({`   `subsets: ['latin'],`   `display: 'swap',`   `variable: '--font-inter',`   `weight: ["400", "500", "600", "700"],` `})` |
| :---: | :---- |

| Nivel | Tamaño | Peso | Uso | Tailwind class |
| :---- | :---- | :---- | :---- | :---- |
| display-2xl | 48px / 3rem | 700 Bold | Headline del hero en biffco.co | text-5xl font-bold |
| display-xl | 36px / 2.25rem | 700 Bold | Títulos de sección en landing | text-4xl font-bold |
| display-lg | 30px / 1.875rem | 700 Bold | Títulos de página en el dashboard | text-3xl font-bold |
| h1 | 24px / 1.5rem | 700 Bold | Encabezados de sección dentro de páginas | text-2xl font-bold |
| h2 | 20px / 1.25rem | 600 Semibold | Sub-secciones, titulos de card | text-xl font-semibold |
| h3 | 16px / 1rem | 600 Semibold | Titulos de grupo, labels de panel | text-base font-semibold |
| body-lg | 16px / 1rem | 400 Regular | Texto de cuerpo, descripciones largas | text-base |
| body | 14px / 0.875rem | 400 Regular | Texto estándar de UI, labels de tabla | text-sm |
| body-sm | 12px / 0.75rem | 400 Regular | Texto auxiliar, timestamps, metadatos | text-xs |
| label | 12px / 0.75rem | 500 Medium | Labels de input, column headers de tabla | text-xs font-medium |
| caption | 11px / 0.6875rem | 400 Regular | Copyright, tooltips, texto legal | text-\[11px\] |

## **JetBrains Mono — datos técnicos**

JetBrains Mono Variable. Usada exclusivamente para datos técnicos que necesitan ser legibles en formato monoespaciado: hashes, claves, IDs, txHash, código.

| `ts` | `// apps/platform/src/app/layout.tsx` `import { JetBrains_Mono } from 'next/font/google'` `const jetbrainsMono = JetBrains_Mono({`   `subsets: ['latin'],`   `display: 'swap',`   `variable: '--font-mono',`   `weight: ["400", "500"],` `})` |
| :---: | :---- |

| Uso | Tamaño | Peso | Ejemplo | Tailwind |
| :---- | :---- | :---- | :---- | :---- |
| SHA-256 hash completo | 13px | 400 | a3f8d2c1e9b0... (64 chars) | font-mono text-\[13px\] |
| Hash truncado (header) | 12px | 400 | a3f8d2c1...9e4f | font-mono text-xs |
| Ed25519 public key | 12px | 400 | 0x3A86FF4...D2C1 | font-mono text-xs |
| txHash (Polygon) | 13px | 500 | 0x4f2d8a1...c3e9 | font-mono text-\[13px\] font-medium |
| EID / RFID | 13px | 500 | AR-2024-001-1234 | font-mono text-\[13px\] font-medium |
| Código en documentación | 13px | 400 | pnpm db:migrate | font-mono text-\[13px\] |
| Número de versión | 12px | 400 | v3.1.0 | font-mono text-xs |

## **Reglas de uso tipográfico**

* NUNCA usar Inter para hashes o claves — siempre JetBrains Mono. Los caracteres similares (0, O, 1, l, I) son ambiguos en Inter.

* NUNCA mezclar pesos en la misma oración (bold \+ regular en el mismo párrafo está bien, bold \+ bold es redundante).

* El line-height por defecto de Tailwind (leading-normal \= 1.5) para body. Para headings: leading-tight (1.25).

* Tracking (letter-spacing): default para body. tracking-tight para display grande. NUNCA tracking-widest en texto de cuerpo.

* Límite de línea (max-width): text-wrap en 65–75 caracteres para cuerpo. Sin límite para UI (labels, botones, headers de tabla).

# **05\. Espaciado y Grid**

BIFFCO usa un sistema de espaciado basado en múltiplos de 4px. Todos los valores de margin, padding y gap son múltiplos de esta unidad base. Tailwind 4 nos da las clases directas — nunca usar valores arbitrarios en producción.

## **La escala de espaciado**

| Token | Valor | Tailwind | Uso típico |
| :---- | :---- | :---- | :---- |
| space-0.5 | 2px | p-0.5 / m-0.5 | Ajuste fino de ícono dentro de botón |
| space-1 | 4px | p-1 / m-1 | Gap mínimo entre elementos inline |
| space-2 | 8px | p-2 / m-2 | Padding interno de badge, gap entre ícono y texto |
| space-3 | 12px | p-3 / m-3 | Padding interno de input pequeño |
| space-4 | 16px | p-4 / m-4 | Padding estándar de card, padding de botón |
| space-5 | 20px | p-5 / m-5 | Padding de sección dentro de un panel |
| space-6 | 24px | p-6 / m-6 | Padding de card principal, gap entre secciones |
| space-8 | 32px | p-8 / m-8 | Padding de página, gap entre cards |
| space-10 | 40px | p-10 / m-10 | Separación entre secciones principales |
| space-12 | 48px | p-12 / m-12 | Padding de hero sections en marketing |
| space-16 | 64px | p-16 / m-16 | Separación entre bloques de la landing |
| space-20 | 80px | p-20 / m-20 | Margen de sección en biffco.co |

## **El grid del sistema — 12 columnas**

La plataforma usa un grid de 12 columnas con gutter de 24px (space-6). Las apps de marketing y verificación pública usan max-w-7xl (1280px) centrado. El dashboard usa un layout fixed (sidebar \+ contenido).

| Breakpoint | Clase Tailwind | Ancho | Columnas activas | Uso |
| :---- | :---- | :---- | :---- | :---- |
| Mobile | (base) | \< 640px | 4 columnas | Cards apiladas. El Operations Dashboard se ve en mobile para Carrier. |
| Tablet | sm: | 640px–1024px | 8 columnas | Management Dashboard con sidebar colapsado. |
| Desktop pequeño | lg: | 1024px–1280px | 12 columnas | Layout completo del dashboard. |
| Desktop estándar | xl: | 1280px–1536px | 12 columnas | Layout estándar — el más común del equipo. |
| Desktop grande | 2xl: | ≥ 1536px | 12 columnas con max-width | El contenido no crece más allá de 1280px. |

## **Layout del dashboard — estructura fija**

| `css` | `/* Layout de apps/platform — dos zonas fijas */` `.layout-root {`   `display: grid;`   `grid-template-columns: var(--sidebar-width) 1fr;`   `grid-template-rows: var(--topbar-height) 1fr;`   `min-height: 100dvh;` `}` `:root {`   `--sidebar-width: 240px;       /* Sidebar expandido */`   `--sidebar-collapsed: 64px;    /* Sidebar colapsado (solo íconos) */`   `--topbar-height: 56px;        /* Topbar fija */`   `--content-max-width: 1280px;  /* Ancho máximo del área de contenido */` `}` `/* El contenido principal siempre tiene este padding */` `.content-area {`   `padding: var(--space-6);      /* 24px en todos los lados */`   `max-width: var(--content-max-width);` `}` |
| :---: | :---- |

# **06\. Border radius, sombras y elevación**

## **Border radius**

BIFFCO usa bordes redondeados consistentes. El radio más grande (pill) se reserva exclusivamente para botones y badges de estado. Los inputs y cards tienen radios medios.

| Token CSS | Valor | Tailwind | Uso |
| :---- | :---- | :---- | :---- |
| \--radius-xs | 2px | rounded-sm | Bordes de código inline, chips muy pequeños |
| \--radius-sm | 4px | rounded | Bordes de tablas, tooltips, dropdown items |
| \--radius-md | 8px | rounded-md | Inputs, textareas, selects, badges normales |
| \--radius-lg | 12px | rounded-xl | Cards principales, modales, panels |
| \--radius-xl | 16px | rounded-2xl | Cards de features en biffco.co, hero cards |
| \--radius-pill | 9999px | rounded-full | Botones, status badges, avatares |

| `css` | `:root {`   `--radius-xs:   2px;`   `--radius-sm:   4px;`   `--radius-md:   8px;`   `--radius-lg:   12px;`   `--radius-xl:   16px;`   `--radius-pill: 9999px;`   `/* shadcn/ui usa esta variable para sus componentes */`   `--radius: var(--radius-md);` `}` |
| :---: | :---- |

## **Sombras y elevación**

Las sombras comunican elevación — qué está encima de qué. BIFFCO usa sombras muy sutiles para evitar el look "overdesigned". Los elementos interactivos se elevan en hover, no en reposo.

| Token | Valor CSS | Tailwind | Cuándo usar |
| :---- | :---- | :---- | :---- |
| shadow-xs | 0 1px 2px rgba(0,0,0,0.04) | shadow-sm | Inputs, badges, separadores sutiles |
| shadow-sm | 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04) | shadow | Cards en reposo, dropdowns |
| shadow-md | 0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04) | shadow-md | Cards en hover, paneles elevados |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04) | shadow-lg | Modales, popovers, tooltips |
| shadow-xl | 0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04) | shadow-xl | Command palette, search global |
| shadow-focus | 0 0 0 3px rgba(58,134,255,0.3) | ring-2 ring-\[var(--color-primary)\]/30 | Focus rings en inputs y botones |

| `css` | `:root {`   `--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);`   `--shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);`   `--shadow-md: 0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);`   `--shadow-lg: 0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04);`   `--shadow-xl: 0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04);`   `--shadow-focus: 0 0 0 3px rgba(58,134,255,0.3);` `}` |
| :---: | :---- |

# **07\. Iconografía — Tabler Icons**

BIFFCO usa Tabler Icons exclusivamente. Es una librería de íconos open source con \+5000 íconos en estilo outline consistente, perfectos para interfaces de datos técnicos. Se integra directamente con React.

## **Setup**

| `bash` | `$ pnpm --filter @biffco/platform add @tabler/icons-react` `# Uso básico:` `import { IconCheck, IconX, IconChevronDown } from '@tabler/icons-react'` `<IconCheck size={16} stroke={2} />` `<IconX size={16} stroke={1.5} />` |
| :---: | :---- |

## **Tamaños de ícono y stroke**

| Contexto | size | stroke | Tailwind adicional |
| :---- | :---- | :---- | :---- |
| Dentro de botón pequeño (sm) | 14 | 2 | — |
| Dentro de botón estándar (md) | 16 | 2 | — |
| Dentro de botón grande (lg) | 18 | 2 | — |
| Label de input, helper text | 14 | 1.5 | — |
| Ícono standalone en UI (sidebar) | 20 | 1.5 | — |
| Ícono de estado (SignatureBadge) | 16 | 2.5 | — |
| Ícono en empty state | 48 | 1 | text-\[var(--color-text-muted)\] |
| Ícono en hero de marketing | 64 | 1 | text-\[var(--color-primary)\] |

## **Íconos del sistema BIFFCO — catálogo**

Estos son los íconos que aparecen en BIFFCO con mayor frecuencia. Usar siempre el mismo ícono para el mismo concepto en toda la app.

| Concepto | Ícono Tabler | Import |
| :---- | :---- | :---- |
| Firma válida / success | IconCheck (verde) | IconCheck |
| Firma inválida / error | IconX (rojo) | IconX |
| Firma pendiente | IconClock (neutral) | IconClock |
| Hold activo / bloqueado | IconLock (rojo) | IconLock |
| Hold levantado / libre | IconLockOpen (verde) | IconLockOpen |
| Asset — animal / ganadería | IconDog o IconCow | IconDog |
| Asset — mineral / minería | IconDiamond | IconDiamond |
| Asset genérico / caja | IconPackage | IconPackage |
| Evento / hecho firmado | IconFileCheck | IconFileCheck |
| Transferencia | IconArrowRight | IconArrowRight |
| Grupo de assets | IconStack | IconStack |
| Split (dividir) | IconSplit | IconSplit |
| Merge (combinar) | IconGitMerge | IconGitMerge |
| Transform / faena | IconTransform | IconTransform |
| QR code | IconQrcode | IconQrcode |
| Blockchain / anchor | IconAnchor | IconAnchor |
| Localización / mapa | IconMapPin | IconMapPin |
| Polígono / parcela | IconPolygon | IconPolygon |
| Wallet / clave | IconWallet | IconWallet |
| Workspace | IconBuilding | IconBuilding |
| WorkspaceMember | IconUser | IconUser |
| Team | IconUsers | IconUsers |
| Employee sin cuenta | IconUserQuestion | IconUserQuestion |
| Inspector / regulatorio | IconBadge | IconBadge |
| Laboratorio | IconFlask | IconFlask |
| Transportista | IconTruck | IconTruck |
| Frigorífico | IconMeat | IconMeat |
| Exportador | IconShip | IconShip |
| EUDR / compliance | IconLeaf | IconLeaf |
| Alerta / warning | IconAlertTriangle | IconAlertTriangle |
| Info | IconInfoCircle | IconInfoCircle |
| Configuración | IconSettings | IconSettings |
| Buscar | IconSearch | IconSearch |
| Filtrar | IconFilter | IconFilter |
| Descargar | IconDownload | IconDownload |
| Ver / detalle | IconEye | IconEye |
| Editar | IconPencil | IconPencil |
| Eliminar / archivo | IconTrash | IconTrash |
| Copiar | IconCopy | IconCopy |
| Cerrar sesión | IconLogout | IconLogout |
| Notificaciones | IconBell | IconBell |
| Sync / cargando | IconRefresh | IconRefresh |
| Expand / colapsar | IconChevronDown / IconChevronRight | — |

|  | *Nunca mezclar Tabler Icons con otros sets (Heroicons, Lucide, etc.). La coherencia del estilo visual depende de usar un solo set. Tabler tiene el ícono que necesitás — buscarlo antes de considerar otra opción.* |
| :---- | :---- |

# **08\. Modo oscuro**

BIFFCO soporta dark mode vía el atributo data-theme="dark" en el elemento \<html\>. Todos los componentes respetan automáticamente el tema porque usan variables CSS. La preferencia del usuario se guarda en localStorage y se sincroniza con la DB del WorkspaceMember.

## **Cómo funciona**

| `css` | `/* globals.css — Light mode (default) */` `:root {`   `--color-surface:           #FFFFFF;`   `--color-surface-raised:    #F9FAFB;`   `--color-bg:                #F9FAFB;`   `--color-text-primary:      #0F1623;`   `--color-text-secondary:    #6B7280;`   `--color-border:            #E5E7EB;`   `/* ... más tokens ... */` `}` `/* Dark mode — mismas variables, valores distintos */` `[data-theme="dark"] {`   `--color-surface:           #0F1623;`   `--color-surface-raised:    #1A2336;`   `--color-bg:                #0B132B;`   `--color-text-primary:      #F1F5F9;`   `--color-text-secondary:    #94A3B8;`   `--color-border:            #2A3854;`   `--color-border-strong:     #3D507A;` `}` |
| :---: | :---- |

## **Colores de dark mode — paleta completa**

| Token | Light | Dark | Notas |
| :---- | :---- | :---- | :---- |
| \--color-bg | \#F9FAFB | \#0B132B | El navy más oscuro como fondo base en dark. |
| \--color-surface | \#FFFFFF | \#0F1623 | Cards, modales, panels. |
| \--color-surface-raised | \#F9FAFB | \#1A2336 | Filas alternas, inputs, tooltips. |
| \--color-surface-overlay | \#F3F4F6 | \#212D45 | Hover states, code blocks. |
| \--color-text-primary | \#0F1623 | \#F1F5F9 | Texto principal. |
| \--color-text-secondary | \#6B7280 | \#94A3B8 | Texto secundario. |
| \--color-text-muted | \#9CA3AF | \#64748B | Texto deshabilitado. |
| \--color-border | \#E5E7EB | \#2A3854 | Bordes en reposo. |
| \--color-border-strong | \#D1D5DB | \#3D507A | Bordes activos, separadores. |
| \--color-primary | \#3A86FF | \#3A86FF | El azul no cambia entre temas. |
| \--color-success | \#059669 | \#059669 | El verde no cambia. |
| \--color-error | \#DC2626 | \#F87171 | Rojo más claro en dark para mejor contraste. |
| \--color-warning | \#D97706 | \#FBBF24 | Amber más claro en dark. |

## **Toggle de tema — implementación**

| `ts` | `// hooks/useTheme.ts` `import { useEffect, useState } from 'react'` `type Theme = 'light' | 'dark'` `export function useTheme() {`   `const [theme, setTheme] = useState<Theme>('light')`   `useEffect(() => {`     `// Leer preferencia guardada o sistema`     `const saved = localStorage.getItem('theme') as Theme | null`     `const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`     `const initial = saved ?? systemPrefers`     `setTheme(initial)`     `document.documentElement.setAttribute("data-theme", initial)`   `}, [])`   `const toggle = () => {`     `const next = theme === 'light' ? 'dark' : 'light'`     `setTheme(next)`     `document.documentElement.setAttribute("data-theme", next)`     `localStorage.setItem("theme", next)`     `// Opcional: sincronizar con la DB del WorkspaceMember`   `}`   `return { theme, toggle }` `}` |
| :---: | :---- |

## **Reglas de dark mode**

* NUNCA usar text-gray-700 o similar en Tailwind para texto — siempre text-\[var(--color-text-primary)\]. Las clases grises de Tailwind no respetan el tema.

* NUNCA usar bg-white — siempre bg-\[var(--color-surface)\].

* Las imágenes con fondo blanco en light mode necesitan un fondo explícito en dark mode. Agregar bg-\[var(--color-surface)\] al wrapper.

* El mapa Leaflet no tiene dark mode automático. Para el dark mode del mapa: usar el tile layer oscuro de Carto o Stamen.

* Los gráficos (recharts) necesitan que los colores de axis y grid también sean variables CSS.

# **09\. Componentes — Botones**

Los botones de BIFFCO se construyen sobre el componente Button de shadcn/ui con estilos sobreescritos. Todos son pill shape (rounded-full). La jerarquía visual comunica la importancia de la acción.

## **Variantes**

| Variante | Color fondo | Color texto | Borde | Cuándo usar |
| :---- | :---- | :---- | :---- | :---- |
| primary | \--color-primary | Blanco | Ninguno | Acción principal de la página. Solo 1 por vista. Firmar evento, Registrar, Continuar. |
| secondary | \--color-surface | \--color-text-primary | \--color-border | Acciones secundarias. Cancelar, Editar, Ver detalle. |
| ghost | Transparente | \--color-text-primary | Ninguno | Acciones terciarias. Íconos de acción en tablas, links de navegación. |
| destructive | \--color-error | Blanco | Ninguno | Acciones irreversibles. Revocar acceso, Reportar robo. |
| outline | Transparente | \--color-primary | \--color-primary | Acciones de afirmación sin ser el CTA principal. Descargar PDF, Copiar hash. |

## **Tamaños**

| Tamaño | Altura | Padding H | Font size | Ícono size | Uso |
| :---- | :---- | :---- | :---- | :---- | :---- |
| xs | 24px | 8px | 11px | 12px | Acciones inline en tablas, chips de acción |
| sm | 32px | 12px | 12px | 14px | Acciones en toolbars, botones secundarios en mobile |
| md (default) | 40px | 16px | 14px | 16px | Estándar de la plataforma |
| lg | 48px | 20px | 16px | 18px | CTAs principales en páginas de marketing |
| xl | 56px | 24px | 18px | 20px | Hero CTA en biffco.co |

## **Estados**

| Estado | Comportamiento visual |
| :---- | :---- |
| default | El estado de reposo. Sin sombra. |
| hover | bg se oscurece o aclara levemente. cursor: pointer. transition: 150ms ease. |
| focus-visible | ring de 3px con \--color-primary/30. El mismo ring en todos los elementos interactivos. |
| active / pressed | Escala levemente: scale-95. Feedback háptico visual. |
| disabled | opacity-50. cursor: not-allowed. Nunca remover el foco del tab order — usar aria-disabled. |
| loading | Ícono de spinner reemplaza el ícono izquierdo (o aparece solo si no hay ícono). El texto cambia a "Guardando..." u equivalente. El botón queda disabled. |

## **Código — Button component (shadcn/ui customizado)**

| `ts` | `// packages/ui/src/components/ui/button.tsx` `// Basado en shadcn/ui — sobreescribimos los estilos con los tokens de BIFFCO` `import { cva } from 'class-variance-authority'` `export const buttonVariants = cva(`   `// Base: todos los botones comparten estas clases`   `'inline-flex items-center justify-center gap-2 rounded-full font-medium',`   `'transition-all duration-150 cursor-pointer',`   `'focus-visible:outline-none focus-visible:ring-2',`   `'focus-visible:ring-[var(--color-primary)]/30',`   `'disabled:opacity-50 disabled:cursor-not-allowed',`   `'active:scale-95',`   `{`     `variants: {`       `variant: {`         `primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',`         `secondary: 'bg-[var(--color-surface)] text-[var(--color-text-primary)]',`                    `'border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)]',`         `ghost: 'bg-transparent text-[var(--color-text-primary)]',`                `'hover:bg-[var(--color-surface-overlay)]',`         `destructive: 'bg-[var(--color-error)] text-white hover:bg-red-700',`         `outline: 'bg-transparent text-[var(--color-primary)]',`                  `'border border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]',`       `},`       `size: {`         `xs: 'h-6 px-2 text-[11px] [&>svg]:size-3',`         `sm: 'h-8 px-3 text-xs [&>svg]:size-3.5',`         `md: 'h-10 px-4 text-sm [&>svg]:size-4',`         `lg: 'h-12 px-5 text-base [&>svg]:size-[18px]',`         `xl: 'h-14 px-6 text-lg [&>svg]:size-5',`         `icon: 'h-10 w-10 [&>svg]:size-4',  // Solo ícono, sin texto`       `},`     `},`     `defaultVariants: { variant: "primary", size: "md" },`   `}` `)` |
| :---: | :---- |

# **10\. Componentes — Inputs y Forms**

Todos los inputs de BIFFCO usan react-hook-form para el estado y Zod para la validación. shadcn/ui provee los primitivos de accesibilidad. Los estilos son nuestros.

## **Input estándar — anatomía**

| Elemento | Descripción | Clase Tailwind |
| :---- | :---- | :---- |
| Label | Siempre visible arriba del input. font-medium text-sm. Nunca flotante ni dentro del input. | text-sm font-medium text-\[var(--color-text-primary)\] |
| Input field | Altura 40px. Border radius md (8px). Fondo surface. Borde en reposo. | h-10 w-full rounded-md border border-\[var(--color-border)\] bg-\[var(--color-surface)\] px-3 text-sm |
| Estado focus | Ring de 3px. El borde cambia a primary. | focus:outline-none focus:ring-2 focus:ring-\[var(--color-primary)\]/30 focus:border-\[var(--color-primary)\] |
| Estado error | Borde rojo. Helper text rojo debajo. | border-\[var(--color-error)\] focus:ring-\[var(--color-error)\]/30 |
| Helper text | 12px, color secondary. Error en rojo. | text-xs text-\[var(--color-text-secondary)\] |
| Ícono izquierdo | Dentro del input, 16px, color muted. Padding compensado. | pl-9 \[&\>svg\]:absolute \[&\>svg\]:left-3 \[&\>svg\]:text-\[var(--color-text-muted)\] |
| Sufijo / Badge | Dentro del input, alineado a la derecha. Para mostrar unidades (kg, ha). | pr-12 |

## **Componentes de form disponibles**

| Componente | shadcn/ui base | Uso en BIFFCO | Import |
| :---- | :---- | :---- | :---- |
| Input | Input | Texto, números, búsqueda, EID/RFID | @/components/ui/input |
| Textarea | Textarea | Observaciones, notas, descripción de incidencia | @/components/ui/textarea |
| Select | Select | Tipo de asset, categoría, estado, rol | @/components/ui/select |
| Combobox | Command \+ Popover | Búsqueda de actors, buscar asset por EID | @/components/ui/combobox |
| DatePicker | Calendar \+ Popover | occurredAt del evento, fecha de vencimiento DTE | @/components/ui/date-picker |
| DateRangePicker | Calendar \+ Popover | Filtros de fecha en tablas, rangos de analytics | @/components/ui/date-range-picker |
| Checkbox | Checkbox | Selección múltiple en tablas, confirmaciones | @/components/ui/checkbox |
| Switch | Switch | Habilitar/deshabilitar features, toggle dark mode | @/components/ui/switch |
| RadioGroup | RadioGroup | Selección exclusiva (tipo de transfer, tipo de baja) | @/components/ui/radio-group |
| Slider | Slider | Rangos de peso, filtros numéricos | @/components/ui/slider |
| FileUpload | —(custom) | Upload de evidencias con SHA-256 inline | @biffco/ui/evidence-uploader |
| PolygonEditor | Leaflet draw | Definir polígono de Facility/Zone | @biffco/ui/polygon-editor |

## **DynamicFormRenderer — el formulario universal**

Todo evento en BIFFCO se registra a través del DynamicFormRenderer. Recibe un UISchema del VerticalPack y renderiza el formulario correcto sin código específico por vertical. Es el componente más importante de la Fase B.

| Widget type | Componente renderizado | Validación automática |
| :---- | :---- | :---- |
| "text" | Input con label, placeholder y helper text | z.string() con min/max/pattern del UIField |
| "number" | Input type="number" con unidad opcional en sufijo | z.number() con min/max del UIField |
| "date" | DatePicker. El valor es siempre ISO 8601 string. | z.string().datetime() |
| "select" | Select con options del UIField | z.enum(\[...options\]) |
| "multiselect" | Combobox multi-selección con chips | z.array(z.string()) |
| "file-upload" | EvidenceUploader: drag & drop, SHA-256 visible, ClamAV status | z.object({hash, s3Key, mimeType, sizeBytes}) |
| "geo-polygon" | PolygonEditor Leaflet: dibujar polígono o importar GeoJSON | z.object({type: "Polygon", coordinates: ...}) |
| "textarea" | Textarea redimensionable | z.string() con min/max |
| "toggle" | Switch con label | z.boolean() |

# **11\. Componentes — Cards, Badges y Tags**

## **Card — variantes**

| Variante | Descripción | Tailwind base |
| :---- | :---- | :---- |
| Card default | Surface blanca, border, radius-lg, shadow-sm. El componente base. | bg-\[var(--color-surface)\] border border-\[var(--color-border)\] rounded-xl shadow-sm |
| Card raised | Sombra más pronunciada. Para cards que necesitan más jerarquía. | bg-\[var(--color-surface)\] rounded-xl shadow-md |
| Card interactive | Agrega hover con elevación. Para cards clicables (Workspace cards en el dashboard). | ... hover:shadow-md hover:border-\[var(--color-border-strong)\] transition-all cursor-pointer |
| Card flat | Sin sombra, con fondo surface-raised. Para contenido dentro de otro card. | bg-\[var(--color-surface-raised)\] rounded-lg border border-\[var(--color-border)\] |
| Card navy | Fondo navy con texto blanco. Para headers de sección prominentes. | bg-\[var(--color-navy)\] text-white rounded-xl |

## **Badge — sistema completo**

Los badges comunican estado de un asset, de una firma, o de un proceso. Son siempre pill shape y tienen una variante de icono opcional.

| Badge | Color fondo | Color texto | Ícono | Cuándo usar |
| :---- | :---- | :---- | :---- | :---- |
| success | \--color-success-subtle (\#DEFFD6) | \--color-success (\#059669) | IconCheck | Asset activo, firma válida, EUDR compliant, proceso completado. |
| error | \--color-error-subtle (\#FFF5F5) | \--color-error (\#DC2626) | IconX | Firma inválida, hold activo, error crítico. |
| warning | \--color-warning-subtle (\#FFFBEB) | \--color-warning (\#D97706) | IconAlertTriangle | Datos próximos a vencer, EUDR pendiente, advertencias. |
| info | \--color-primary-subtle (\#D6EAFF) | \--color-primary (\#3A86FF) | IconInfoCircle | Información neutral, estados en tránsito, pendientes. |
| neutral | \--color-surface-raised (\#F9FAFB) | \--color-text-secondary (\#6B7280) | — | Estados inactivos, datos sin clasificar. |
| navy | \--color-navy (\#0B132B) | white | — | Versión oscura para fondos claros prominentes. |
| teal | \#E0F7F5 (teal-50) | \--color-teal (\#0D9488) | IconAnchor | Anclado en blockchain, verificado on-chain. |
| purple | \#F3E8FF (purple-50) | \--color-purple (\#5A189A) | IconShield | Auditoría completa, compliance verificado. |

## **Status Badge — estados de assets**

| Asset status | Badge a mostrar | Texto |
| :---- | :---- | :---- |
| active | success | Activo |
| in\_transit | info | En tránsito |
| in\_process | info | En proceso |
| locked | error | Hold activo |
| quarantine | error | Cuarentena |
| closed | neutral | Cerrado |
| recalled | error | Bajo recall |
| stolen | error | Robado |
| lost | warning | Extraviado |

# **12\. Componentes — Navigation (Sidebar y Topbar)**

## **Sidebar — especificaciones**

| Elemento | Descripción |
| :---- | :---- |
| Ancho expandido | 240px. Fondo \--color-navy. Texto blanco. |
| Ancho colapsado | 64px. Solo íconos centrados. El isotipo de BIFFCO reemplaza el logo completo. |
| Toggle | IconChevronLeft / IconChevronRight en el borde del sidebar. Persistido en localStorage. |
| Sección de workspace | En la parte superior: isotipo/logo \+ nombre del Workspace \+ badge del VerticalPack activo. |
| Nav items | Ícono (20px, stroke 1.5) \+ label. Altura 40px. Radius 8px. Estado activo: bg blanco/10%. |
| Nav groups | Los items se agrupan por sección: "Gestión" (workspace, members), "Operaciones" (assets, events), "Compliance" (eudr, analytics). |
| Separadores | Línea de 1px con opacity 20% entre grupos. |
| Footer del sidebar | Avatar del usuario \+ nombre \+ botón de logout (IconLogout). Ocupa el fondo del sidebar. |
| Workspace switcher | Click en el nombre del Workspace → dropdown con todos los Workspaces del usuario. |

## **Topbar — especificaciones**

| Elemento | Posición | Descripción |
| :---- | :---- | :---- |
| Breadcrumbs | Izquierda | Muestra la ruta actual: Workspace \> Sección \> Sub-sección. Links clicables excepto el último. |
| SyncStatusBadge | Centro-izquierda | Muestra el estado del AnchorBatchJob: "Sincronizado", "Sincronizando...", "N eventos pendientes", "Error de sync". Con ícono animado. |
| SearchBar (global) | Centro | Input de búsqueda global. Shortcut: Cmd+K. Abre el Command Palette (shadcn/ui Command). |
| NotificationBell | Derecha | IconBell con badge de contador. Click → dropdown con las últimas 10 notificaciones. |
| ThemeToggle | Derecha | Switch dark/light. IconSun / IconMoon. |
| UserAvatar | Extremo derecha | Avatar del WorkspaceMember activo \+ dropdown: Mi cuenta, Cambiar Workspace, Configuración, Logout. |

## **Command Palette — búsqueda global**

Activado con Cmd+K (Mac) o Ctrl+K (Windows). Busca assets por EID, eventos por tipo, WorkspaceMembers por nombre, Facilities por nombre. Se construye con el componente Command de shadcn/ui.

| Grupo de búsqueda | Qué busca | Ícono |
| :---- | :---- | :---- |
| Assets | Por EID, por ID interno, por tipo | IconPackage |
| Eventos | Por tipo, por actor firmante, por fecha | IconFileCheck |
| Actores | WorkspaceMembers y Employees por nombre | IconUser |
| Ubicaciones | Facilities, Zones, Pens por nombre | IconMapPin |
| Acciones rápidas | Atajos: "Registrar animal", "Iniciar transfer", "Crear Facility" | IconZap |

# **13\. Componentes — Modales, Drawers y Toasts**

## **Modal (Dialog) — shadcn/ui**

| Propiedad | Especificación |
| :---- | :---- |
| Tamaño sm | max-w-md (448px). Para confirmaciones simples, alertas. |
| Tamaño md (default) | max-w-lg (512px). Para formularios cortos, detalles de un evento. |
| Tamaño lg | max-w-2xl (672px). Para formularios complejos, DynamicFormRenderer con varios campos. |
| Tamaño xl | max-w-4xl (896px). Para vistas detalladas, timelines, DAGVisualizer. |
| Full screen | Para la pantalla del mnemonic (Paso 5 del wizard). Sin overlay clickeable para cerrar. |
| Overlay | bg-black/50 con blur. Click fuera cierra el modal (excepto acciones destructivas y el mnemonic). |
| Header | Título h2 \+ botón X (ghost icon-only). Siempre presente. |
| Footer | Botones alineados a la derecha: acción secundaria (secondary/ghost) \+ acción primaria. |
| Confirmaciones destructivas | Botón primario es destructive. Se requiere confirmación explícita (checkbox o re-escribir texto). |

## **Drawer — panel lateral**

Los drawers se usan para workflows que necesitan más espacio que un modal pero donde el usuario debe mantener el contexto de la página. Por ejemplo: el detalle de un asset sin abandonar la lista.

| Propiedad | Especificación |
| :---- | :---- |
| Posición | right (por defecto). Aparece desde la derecha. |
| Ancho | 400px (sm), 560px (md), 720px (lg). |
| Overlay | bg-black/30. Click fuera cierra el drawer. |
| Uso principal | Detalle de un evento, formulario de creación de asset, detalle de una transfer. |

## **Toast (Sonner) — notificaciones inline**

BIFFCO usa Sonner para los toasts. Se importa una sola instancia en el layout raíz y se dispara desde cualquier parte de la app con toast().

| Tipo | Cuándo usar | Duración | Código |
| :---- | :---- | :---- | :---- |
| toast.success(msg) | Evento registrado correctamente, transfer aceptada, Facility creada. | 4 segundos | toast.success("Evento registrado") |
| toast.error(msg) | Error de API, firma rechazada, validación bloqueante. | 6 segundos (manual dismiss) | toast.error("Firma inválida — intentá de nuevo") |
| toast.warning(msg) | DTE próximo a vencer, polígono sin validar. | 5 segundos | toast.warning("DTE vence en 48 horas") |
| toast.loading(msg) | Mientras se ancla en Polygon, mientras sube una evidencia. | Manual (se reemplaza con success/error) | const id \= toast.loading("Anclando en Polygon...") |
| toast.info(msg) | Información neutral: "El Inspector fue notificado". | 4 segundos | toast.info("Notificación enviada") |

# **14\. Componentes — Tables y Data Display**

## **Table estándar — especificaciones**

| Elemento | Especificación |
| :---- | :---- |
| Header row | Fondo \--color-surface-raised. text-label (12px, font-medium, uppercase, letter-spacing 0.05em). Height 44px. |
| Data rows | Filas alternas: white / surface-raised. Height 52px. Hover: surface-overlay. |
| Cell padding | Horizontal: 16px. Vertical: 12px. |
| Sorting | Ícono IconChevronUp/Down en el header. Click → ASC → DESC → sin orden. Animación de 150ms. |
| Selection | Checkbox en primera columna. Row selected: fondo primary-subtle. Checkbox de header: seleccionar todo. |
| Actions column | Última columna a la derecha. Ancho fijo 80px. Contiene un dropdown (IconDots) con las acciones de fila. |
| Pagination | Debajo de la tabla: "Mostrando X–Y de Z resultados". Botones Anterior / Siguiente. Selector de página. |
| Empty state | Centered en la tabla: ícono 48px \+ título \+ descripción \+ CTA. Ej: "No hay assets aún — Registrar primer animal". |
| Loading state | Skeleton shimmer en cada fila. El header permanece visible. |

## **Patrones de datos técnicos en tablas**

| Tipo de dato | Cómo mostrarlo |
| :---- | :---- |
| SHA-256 hash | Truncado: primeros 8 \+ "..." \+ últimos 6\. font-mono text-xs. Tooltip con hash completo. Botón de copiar al hover. |
| Ed25519 public key | Truncado: primeros 6 \+ "..." \+ últimos 6\. font-mono text-xs. Tooltip con clave completa. |
| txHash de Polygon | Primeros 8 \+ "..." \+ últimos 6\. font-mono text-xs. Link al explorador de Polygon. |
| EID / caravana | Mostrar completo si cabe. font-mono text-sm font-medium. |
| Fechas y timestamps | Formato: "15 ene 2024, 14:32". Tooltip con ISO 8601 completo. Usar date-fns para formatear. |
| Pesos y medidas | Número con unidad: "247.5 kg". text-sm tabular-nums. La unidad en text-muted. |
| Status badge | Ver sección Badges. Siempre alineado a la izquierda en la celda. |
| WorkspaceMember | Avatar (24px) \+ nombre. Si el espacio es limitado: solo avatar con tooltip del nombre. |

# **15\. Componentes de dominio BIFFCO**

Estos componentes son exclusivos de BIFFCO — no existen en ninguna librería de terceros. Representan conceptos del dominio: eventos firmados, linaje de assets, estado del blockchain, cumplimiento EUDR. Son el corazón visual del sistema.

## **EventTimeline — historial de eventos firmado**

El componente más visto en la plataforma. Muestra el historial de DomainEvents de un asset en orden cronológico. Cada entrada tiene su SignatureBadge. Funciona para cualquier vertical.

| Elemento | Descripción |
| :---- | :---- |
| Línea temporal | Línea vertical de 2px con \--color-border. Puntito de 8px en cada evento. |
| Timestamp | Fecha y hora en font-mono text-xs color-text-secondary. Tooltip con ISO 8601\. |
| Event type badge | Badge neutral o de color según la categoría del evento (ver catálogo de eventos). |
| Actor firmante | Avatar (20px) \+ nombre del WorkspaceMember. Click → perfil. |
| SignatureBadge | ✓ verde (firma válida) / ✗ rojo (inválida) / ⏳ gris (pendiente de verificar). |
| Payload preview | Los 3 campos más relevantes del payload, inline. Click → ver payload completo. |
| Evidencias | Thumbnails de los archivos adjuntos. Click → modal con el documento completo y el SHA-256. |
| BlockchainAnchorBadge | Teal badge con el txHash truncado. Solo si el evento fue incluido en un anchor. |

| `ts` | `// packages/ui/src/components/domain/EventTimeline.tsx` `import { IconCheck, IconX, IconClock, IconAnchor } from '@tabler/icons-react'` `import type { DomainEvent } from '@biffco/core/domain'` `interface Props {`   `events: DomainEvent[]`   `showSignatures?: boolean  // default: true`   `compact?: boolean          // Para vistas donde el espacio es limitado` `}` `// El componente itera sobre los eventos en orden occurredAt ASC` `// Para cada evento llama a verifyEvent() del Core para validar la firma` `// La verificación es lazy: solo se verifica al hacer scroll visible (IntersectionObserver)` |
| :---: | :---- |

## **SignatureBadge — estado de verificación de firma**

| Estado | Visual | Cuándo mostrar |
| :---- | :---- | :---- |
| valid | Badge verde con IconCheck. "Firma válida". Fondo success-subtle. | Después de llamar verifyEvent() y retornar true. |
| invalid | Badge rojo con IconX. "Firma inválida". Fondo error-subtle. | Después de llamar verifyEvent() y retornar false. NUNCA ignorar este estado. |
| pending | Badge gris con IconClock. "Verificando...". Spinner de 12px. | Mientras verifyEvent() está en proceso (es async). |
| skipped | Badge neutral. "Sin verificar". | En vistas muy compactas donde la verificación es opcional. |

## **DAGVisualizer — árbol de linaje de assets**

Visualiza el árbol completo de parentIds de un asset. Muestra la cadena de custodia desde el origen (campo, mina, fábrica) hasta el activo actual. Crucial para la verificación EUDR.

| Elemento | Descripción |
| :---- | :---- |
| Nodo | Rectángulo redondeado con: tipo de asset (badge), ID truncado (font-mono), estado (badge de color). |
| Arista | Línea con flecha. El label muestra el tipo de transformación (Split, Merge, Transform) si aplica. |
| Nodo actual | Borde de 2px con \--color-primary. Ligeramente más grande. |
| Nodo con alerta | Borde rojo si el asset tiene hold activo o alerta GFW. Se hereda visualmente hacia los descendientes. |
| Interactividad | Click en un nodo → ver detalle del asset en un drawer. Zoom y pan. Export PNG. |
| Librería | react-flow (libre y open source). Estilos con variables CSS de BIFFCO. |

## **BlockchainAnchorBadge — anclaje verificable**

| `ts` | `// packages/ui/src/components/domain/BlockchainAnchorBadge.tsx` `import { IconAnchor, IconExternalLink } from '@tabler/icons-react'` `interface Props {`   `txHash: string`   `network: 'polygon-amoy' | 'polygon-mainnet'`   `confirmedAt?: Date` `}` `// Renderiza: ⛓ 0xa3f8...9e4f → link a Polygonscan` `// Badge teal con hover que muestra: red, bloque, timestamp de confirmación` |
| :---: | :---- |

## **AssetMap — mapa de ubicación con polígono EUDR**

| Elemento | Descripción |
| :---- | :---- |
| Mapa base | Leaflet con tiles de CartoDB (light y dark). Libre, sin API key. |
| Polígono de Zone | Polígono GeoJSON de la Zone donde estuvo el asset. Color según estado GFW. |
| GFW indicator | Si el polígono tiene alerta de Global Forest Watch: overlay rojo con texto "Alerta de deforestación". |
| Marcador de asset | IconMapPin con el color del estado del asset. Click → popup con datos del asset. |
| Historial de movimientos | Polyline que conecta las Zones anteriores del asset (de LOCATION\_CHANGED events). |

## **EvidenceThumb — visualizador de evidencias**

| Elemento | Descripción |
| :---- | :---- |
| Thumbnail | Preview del archivo si es imagen. Ícono según MIME type si es PDF/DOC. |
| SHA-256 | Primeros 8 chars en font-mono debajo del thumbnail. Tooltip con hash completo. |
| Estado ClamAV | Badge "Escaneado ✓" o "En revisión". Nunca mostrar un archivo antes de que pase el scan. |
| Descarga | Click → modal con el documento completo \+ botón de descarga. El hash se re-verifica antes de la descarga. |

## **SyncStatusBadge — estado del AnchorBatchJob**

| Estado | Visual | Cuándo |
| :---- | :---- | :---- |
| synced | Badge teal. IconCheck. "Sincronizado". Sin spinner. | Todos los eventos del Workspace tienen txHash. |
| syncing | Badge teal outline. Spinner de 12px. "Anclando N eventos..." | El AnchorBatchJob está corriendo. |
| pending | Badge neutral. IconClock. "N eventos pendientes" | Hay eventos sin anclar (job aún no corrió). |
| error | Badge rojo. IconAlertTriangle. "Error de sync" | El job falló. Con tooltip del error. |
| offline | Badge neutral. IconWifi. "Sin conexión" | El cliente está offline (Workbox). |

## **GeoComplianceBadge — estado EUDR del asset**

| Estado | Visual |
| :---- | :---- |
| compliant | Badge success. IconLeaf. "EUDR Compliant". Verde. |
| pending\_polygon | Badge warning. "Sin polígono declarado". Amarillo. |
| gfw\_alert | Badge error. "Alerta de deforestación". Rojo. |
| pending\_inspection | Badge warning. "Inspección requerida". Amarillo. |
| no\_dte | Badge error. "DTE vencido o ausente". Rojo. |

# **16\. Motion y animación**

BIFFCO usa animaciones funcionales — no decorativas. Cada animación tiene un propósito: feedback de acción, orientación espacial, o comunicación de estado. Sin animaciones por estética pura.

## **Principios**

* DURACIÓN: 100ms para micro-interacciones (hover, focus). 150ms para transiciones de estado. 250ms para entrada/salida de elementos. 400ms máximo para transiciones de página. Nunca más de 400ms — se siente lento.

* EASING: ease-out para entradas (elementos que llegan). ease-in para salidas (elementos que se van). ease-in-out para transformaciones de estado.

* REDUCCIÓN: Siempre respetar prefers-reduced-motion. Usar la clase motion-safe: de Tailwind para animaciones no esenciales.

* PROPÓSITO: Si remover la animación hace la UI menos comprensible, es funcional y debe quedarse. Si solo se ve "lindo", considerar sacarla.

## **Durations — variables CSS**

| `css` | `:root {`   `--duration-fast:   100ms;   /* Hover, focus rings, micro-feedback */`   `--duration-normal: 150ms;   /* Transiciones de estado, botones */`   `--duration-slow:   250ms;   /* Entrada/salida de elementos */`   `--duration-slower: 400ms;   /* Transiciones de página (max) */`   `--ease-in:     cubic-bezier(0.4, 0, 1, 1);`   `--ease-out:    cubic-bezier(0, 0, 0.2, 1);`   `--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);` `}` |
| :---: | :---- |

## **Animaciones del sistema**

| Animación | Duración | Easing | Uso | Tailwind |
| :---- | :---- | :---- | :---- | :---- |
| fade-in | 200ms | ease-out | Entradas de modales, toasts, tooltips | animate-in fade-in |
| fade-out | 150ms | ease-in | Salidas de modales, toasts | animate-out fade-out |
| slide-in-from-right | 250ms | ease-out | Entrada de drawers | animate-in slide-in-from-right |
| slide-in-from-top | 200ms | ease-out | Entrada de dropdowns, command palette | animate-in slide-in-from-top-2 |
| zoom-in-95 | 200ms | ease-out | Entrada de modales (escala desde 95%) | animate-in zoom-in-95 |
| spin | 1000ms | linear | Spinner de loading | animate-spin |
| pulse | 2000ms | ease-in-out | Skeleton shimmer de loading | animate-pulse |
| ping | 1000ms | ease-out | Notificación nueva en el NotificationBell | animate-ping |

## **Estado de carga — Skeleton**

Siempre usar Skeleton shimmer en lugar de spinners para contenido que carga. Los spinners se reservan para acciones en progreso (botón enviando, anclando en Polygon).

| `ts` | `// El Skeleton usa CSS animation con el token de duración` `// packages/ui/src/components/ui/skeleton.tsx` `export function Skeleton({ className }: { className?: string }) {`   `return (`     `<div`       `className={cn(`         `'animate-pulse rounded-md bg-[var(--color-surface-overlay)]',`         `className`       `)}`     `/>`   `)` `}` `// Uso en EventTimeline cargando:` `// <Skeleton className='h-4 w-32' />  // timestamp` `// <Skeleton className='h-4 w-64' />  // event type` `// <Skeleton className='h-4 w-48' />  // actor` |
| :---: | :---- |

# **17\. Accesibilidad**

Radix UI (la base de shadcn/ui) implementa ARIA y keyboard navigation en todos los componentes interactivos. Nuestro trabajo es no romperlos y asegurarnos de que los componentes custom también cumplen.

## **Estándares mínimos — WCAG 2.1 AA**

| Criterio | Requisito | Cómo verificarlo |
| :---- | :---- | :---- |
| Contraste de texto | Ratio mínimo 4.5:1 para texto normal. 3:1 para texto grande (≥18px o ≥14px bold). | axe DevTools extension o Colour Contrast Analyser. |
| Keyboard navigation | Todos los elementos interactivos son alcanzables con Tab. El orden es lógico. | Navegar toda la UI solo con teclado. |
| Focus visible | El focus ring es siempre visible. shadow-focus de BIFFCO cumple el contraste. | No agregar outline: none sin un reemplazo visible. |
| Labels en inputs | Todo input tiene un label visible o aria-label. El placeholder NO reemplaza al label. | Revisar con screen reader (VoiceOver / NVDA). |
| Alt en imágenes | Toda imagen decorativa tiene alt="". Toda imagen informativa tiene alt descriptivo. | Inspeccionar el HTML generado. |
| Iconos interactivos | Íconos que son el único contenido de un botón tienen aria-label. | \<button aria-label="Copiar hash"\>IconCopy\</button\> |
| Mensajes de error | Los errores de formulario están vinculados al input con aria-describedby. | react-hook-form \+ shadcn/ui FormMessage lo hacen automáticamente. |

## **Contraste de los colores del sistema**

| Color | Texto sobre él | Ratio | Cumple WCAG AA |
| :---- | :---- | :---- | :---- |
| \--color-navy (\#0B132B) | Blanco (\#FFFFFF) | 15.8:1 | ✅ Excelente |
| \--color-primary (\#3A86FF) | Blanco (\#FFFFFF) | 3.1:1 | ⚠️ Solo texto grande |
| \--color-primary (\#3A86FF) | Navy (\#0B132B) | 4.9:1 | ✅ AA |
| \--color-success (\#059669) | Blanco (\#FFFFFF) | 4.6:1 | ✅ AA |
| \--color-error (\#DC2626) | Blanco (\#FFFFFF) | 4.7:1 | ✅ AA |
| \--color-warning (\#D97706) | Blanco (\#FFFFFF) | 2.8:1 | ❌ No usar texto blanco sobre warning |
| \--color-warning (\#D97706) | Navy (\#0B132B) | 7.2:1 | ✅ Excelente |
| \--color-text-primary (\#0F1623) | Blanco (\#FFFFFF) | 16.2:1 | ✅ Excelente |
| \--color-text-secondary (\#6B7280) | Blanco (\#FFFFFF) | 4.6:1 | ✅ AA |
| \--color-text-muted (\#9CA3AF) | Blanco (\#FFFFFF) | 2.5:1 | ❌ Solo decorativo — no para texto informativo |

|  | ⚠ ATENCIÓN  \--color-text-muted no cumple el contraste mínimo. Solo usarlo para texto decorativo (timestamps en tablas donde el dato principal es otro). Nunca para mensajes de error, labels de input, ni texto crítico. |
| :---- | :---- |

## **Reglas específicas de BIFFCO**

* Los hashes y claves públicas en font-mono son siempre al menos 13px — el tamaño mínimo para que un carácter monoespaciado sea legible en pantallas de baja resolución.

* El DAGVisualizer tiene una tabla alternativa para usuarios que no pueden usar el mapa visual (aria-label en el div del grafo \+ tabindex en nodos).

* La pantalla del mnemonic (Paso 5 del wizard) tiene las 24 palabras en un aria-live region para que un screen reader las lea.

* Los SignatureBadges usan un texto alternativo además del ícono: aria-label="Firma válida" o aria-label="Firma inválida".

* El SyncStatusBadge usa aria-live="polite" para anunciar cambios de estado.

# **18\. Tailwind config \+ globals.css completo**

## **tailwind.config.ts — configuración completa**

| `ts` | `// tailwind.config.ts (en cada app que usa el design system)` `import type { Config } from 'tailwindcss'` `export default {`   `content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],`   `darkMode: ['selector', '[data-theme="dark"]'],`   `theme: {`     `extend: {`       `colors: {`         `// Referenciar las variables CSS en lugar de valores hardcodeados`         `navy:    'var(--color-navy)',`         `primary: 'var(--color-primary)',`         `orange:  'var(--color-orange)',`         `teal:    'var(--color-teal)',`         `purple:  'var(--color-purple)',`         `// Semánticos`         `success: 'var(--color-success)',`         `warning: 'var(--color-warning)',`         `error:   'var(--color-error)',`         `// Texto`         `'text-primary':   'var(--color-text-primary)',`         `'text-secondary': 'var(--color-text-secondary)',`         `'text-muted':     'var(--color-text-muted)',`         `// Superficies`         `surface:         'var(--color-surface)',`         `'surface-raised': 'var(--color-surface-raised)',`         `border:          'var(--color-border)',`       `},`       `fontFamily: {`         `sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],`         `mono: ['var(--font-mono)', 'monospace'],`       `},`       `borderRadius: {`         `'xs':   'var(--radius-xs)',`         `DEFAULT: 'var(--radius-md)',`         `'md':   'var(--radius-md)',`         `'lg':   'var(--radius-lg)',`         `'xl':   'var(--radius-xl)',`         `'pill': 'var(--radius-pill)',`       `},`       `boxShadow: {`         `'xs':    'var(--shadow-xs)',`         `'sm':    'var(--shadow-sm)',`         `'md':    'var(--shadow-md)',`         `'lg':    'var(--shadow-lg)',`         `'xl':    'var(--shadow-xl)',`         `'focus': 'var(--shadow-focus)',`       `},`       `transitionDuration: {`         `'fast':   '100ms',`         `'normal': '150ms',`         `'slow':   '250ms',`         `'slower': '400ms',`       `},`     `},`   `},`   `plugins: [require('tailwindcss-animate')],` `} satisfies Config` |
| :---: | :---- |

## **globals.css — el archivo completo**

| `css` | `@import "tailwindcss";` `@import '@fontsource/inter/400.css';` `@import '@fontsource/inter/500.css';` `@import '@fontsource/inter/600.css';` `@import '@fontsource/inter/700.css';` `@import '@fontsource/jetbrains-mono/400.css';` `@import '@fontsource/jetbrains-mono/500.css';` `/* ═══════════════════════════════════════════════════════════`    `BIFFCO Design System — variables CSS`    `La fuente única de verdad de todos los tokens visuales.`    `Ningún componente tiene valores hardcodeados.` `═══════════════════════════════════════════════════════════ */` `:root {`   `/* ─── Tipografías ──────────────────────────────────── */`   `--font-inter: 'Inter Variable', 'Inter', system-ui, sans-serif;`   `--font-mono:  'JetBrains Mono Variable', 'JetBrains Mono', monospace;`   `/* ─── Colores de marca ─────────────────────────────── */`   `--color-navy:            #0B132B;`   `--color-primary:         #3A86FF;`   `--color-primary-hover:   #2563EB;`   `--color-primary-subtle:  #D6EAFF;`   `--color-orange:          #FF6B35;`   `--color-teal:            #0D9488;`   `--color-teal-subtle:     #CCFBF1;`   `--color-purple:          #5A189A;`   `--color-purple-subtle:   #F3E8FF;`   `/* ─── Semánticos ───────────────────────────────────── */`   `--color-success:         #059669;`   `--color-success-subtle:  #DEFFD6;`   `--color-warning:         #D97706;`   `--color-warning-subtle:  #FFFBEB;`   `--color-error:           #DC2626;`   `--color-error-subtle:    #FFF5F5;`   `/* ─── Texto ────────────────────────────────────────── */`   `--color-text-primary:    #0F1623;`   `--color-text-secondary:  #6B7280;`   `--color-text-muted:      #9CA3AF;`   `--color-text-inverse:    #FFFFFF;`   `/* ─── Superficies ──────────────────────────────────── */`   `--color-bg:              #F9FAFB;`   `--color-surface:         #FFFFFF;`   `--color-surface-raised:  #F9FAFB;`   `--color-surface-overlay: #F3F4F6;`   `--color-border:          #E5E7EB;`   `--color-border-strong:   #D1D5DB;`   `/* ─── Border Radius ────────────────────────────────── */`   `--radius-xs:   2px;`   `--radius-sm:   4px;`   `--radius-md:   8px;`   `--radius-lg:   12px;`   `--radius-xl:   16px;`   `--radius-pill: 9999px;`   `--radius:      var(--radius-md); /* shadcn/ui default */`   `/* ─── Sombras ──────────────────────────────────────── */`   `--shadow-xs:    0 1px 2px rgba(0,0,0,0.04);`   `--shadow-sm:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);`   `--shadow-md:    0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);`   `--shadow-lg:    0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04);`   `--shadow-xl:    0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04);`   `--shadow-focus: 0 0 0 3px rgba(58,134,255,0.3);`   `/* ─── Duraciones ───────────────────────────────────── */`   `--duration-fast:   100ms;`   `--duration-normal: 150ms;`   `--duration-slow:   250ms;`   `--duration-slower: 400ms;`   `/* ─── Layout ───────────────────────────────────────── */`   `--sidebar-width:     240px;`   `--sidebar-collapsed: 64px;`   `--topbar-height:     56px;`   `--content-max-width: 1280px;` `}` `/* ─── Dark Mode ─────────────────────────────────────── */` `[data-theme="dark"] {`   `--color-bg:              #0B132B;`   `--color-surface:         #0F1623;`   `--color-surface-raised:  #1A2336;`   `--color-surface-overlay: #212D45;`   `--color-border:          #2A3854;`   `--color-border-strong:   #3D507A;`   `--color-text-primary:    #F1F5F9;`   `--color-text-secondary:  #94A3B8;`   `--color-text-muted:      #64748B;`   `--color-error:           #F87171;`   `--color-warning:         #FBBF24;`   `--color-primary-subtle:  #1E3A5F;`   `--color-success-subtle:  #064E3B;`   `--color-error-subtle:    #450A0A;`   `--color-warning-subtle:  #451A03;`   `--shadow-focus: 0 0 0 3px rgba(58,134,255,0.4);` `}` `/* ─── Base styles ───────────────────────────────────── */` `* { box-sizing: border-box; }` `body {`   `font-family: var(--font-inter);`   `background-color: var(--color-bg);`   `color: var(--color-text-primary);`   `-webkit-font-smoothing: antialiased;`   `-moz-osx-font-smoothing: grayscale;` `}` `code, kbd, pre, samp {`   `font-family: var(--font-mono);` `}` `/* Scrollbar sutil */` `::-webkit-scrollbar { width: 6px; height: 6px; }` `::-webkit-scrollbar-track { background: transparent; }` `::-webkit-scrollbar-thumb {`   `background: var(--color-border-strong);`   `border-radius: var(--radius-pill);` `}` `::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }` `/* Focus visible uniforme */` `:focus-visible {`   `outline: none;`   `box-shadow: var(--shadow-focus);` `}` `/* Selection */` `::selection {`   `background: var(--color-primary-subtle);`   `color: var(--color-navy);` `}` |
| :---: | :---- |

# **19\. Checklist de implementación**

Este checklist se usa en code review para cualquier PR que toque la UI. Un ✅ en todos los ítems antes del merge.

## **Tokens y valores**

| Ítem | Verificar | Cómo |
| :---- | :---- | :---- |
| Sin colores hardcodeados | No hay \#HEX ni rgb() fuera de globals.css | grep \-r "\#\[0-9A-Fa-f\]{6}" src/ \--include="\*.tsx" \--include="\*.ts" |
| Sin bg-white ni text-gray-X | No hay clases de color Tailwind directas | grep \-rE "bg-white|text-gray|bg-gray" src/ |
| Font-mono para datos técnicos | Hashes, txHash, publicKey, EID usan font-mono | Code review visual \+ search de campos técnicos |
| Espaciado con Tailwind | No hay style={{ margin: "16px" }} ni similar | grep \-r "style=" src/ — verificar que no hay valores de espaciado inline |

## **Componentes shadcn/ui**

| Ítem | Verificar |
| :---- | :---- |
| Archivos de shadcn no modificados | Los archivos en /components/ui/ no tienen cambios respecto al original de shadcn. Los estilos van solo en globals.css y tailwind.config.ts. |
| Dialog con focus trap | Abrir un Dialog y presionar Tab repetidamente: el foco no escapa del modal. |
| Select con keyboard | Abrir un Select y navegar con flechas \+ Enter: funciona sin mouse. |
| Form con errores | Enviar un formulario vacío: los errores aparecen vinculados al input correcto. |

## **Accesibilidad**

| Ítem | Verificar |
| :---- | :---- |
| Botón icon-only con aria-label | Todo botón que contiene solo un ícono (sin texto visible) tiene aria-label. |
| Inputs con label | Todo input tiene un elemento \<label\> o aria-label. El placeholder no es suficiente. |
| Ratio de contraste | Texto sobre fondo nuevo: verificar con la tabla de contraste de la sección 17\. |
| Navegación con teclado | El flujo principal (signup → dashboard → registrar evento) es completable solo con teclado. |
| SignatureBadge con texto alternativo | El SignatureBadge incluye texto descriptivo además del ícono. |

## **Dark mode**

| Ítem | Verificar |
| :---- | :---- |
| Componente probado en dark | Toda vista nueva se revisa en dark mode antes del merge. |
| Imágenes con fondo | Las imágenes con fondo blanco tienen bg-\[var(--color-surface)\] en su wrapper. |
| Gráficos con variables CSS | Los ejes y grids de recharts usan variables CSS, no colores hardcodeados. |
| Iconos sin color inline | Los íconos de Tabler heredan el color del padre con currentColor. |

## **Iconografía**

| Ítem | Verificar |
| :---- | :---- |
| Solo Tabler Icons | No hay íconos de Heroicons, Lucide, Material ni SVGs custom ad-hoc. |
| Tamaño consistente | Los íconos en el mismo contexto tienen el mismo size y stroke. |
| Stroke correcto | Íconos interactivos: stroke 2\. Íconos de fondo/decorativos: stroke 1 o 1.5. |
| Mismo concepto \= mismo ícono | El ícono de "transferencia" es siempre IconArrowRight — no alternar con IconArrowNarrowRight. |

## **Instalación y setup — comandos de referencia**

| `bash` | `# Instalar shadcn/ui en apps/platform` `$ pnpm dlx shadcn@latest init` `# Seleccionar: TypeScript, Tailwind CSS, src/ directory` `# Agregar componentes específicos` `$ pnpm dlx shadcn@latest add button input select dialog` `$ pnpm dlx shadcn@latest add dropdown-menu command calendar` `$ pnpm dlx shadcn@latest add form label checkbox switch` `$ pnpm dlx shadcn@latest add table badge avatar skeleton` `$ pnpm dlx shadcn@latest add toast sonner drawer` `# Instalar Tabler Icons` `$ pnpm --filter @biffco/platform add @tabler/icons-react` `# Instalar dependencias de animación` `$ pnpm --filter @biffco/platform add tailwindcss-animate class-variance-authority clsx` `# Para el DAGVisualizer` `$ pnpm --filter @biffco/platform add @xyflow/react` `# Para el mapa (AssetMap, PolygonEditor)` `$ pnpm --filter @biffco/platform add leaflet react-leaflet` `$ pnpm --filter @biffco/platform add -D @types/leaflet` |
| :---: | :---- |

