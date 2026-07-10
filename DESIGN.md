# Sistema de Diseño — Fisiclass

Guía de los tokens, componentes y convenciones de UI ya implementados en
`src/`. No es un mockup ni un plan de pantallas (eso vive en
[`DESCRIPTION.md`](./DESCRIPTION.md)) — este documento describe lo que
**existe en el código hoy**, para que cualquiera pueda construir una pantalla
nueva reusando las piezas correctas.

## Quick path (cómo construir una pantalla nueva)

1. Envuelve el contenido en `<AppShell role={role} title="...">` (layout).
2. Usa `<Breadcrumbs>` si la pantalla no es la raíz de una sección.
3. Compón la vista con los componentes de `src/components/ui/` (tarjetas,
   tablas, estados vacíos) en vez de escribir HTML suelto.
4. Colores, tipografía, radios y espaciados: solo clases de Tailwind que
   mapean a los tokens de abajo — nunca hex/px sueltos en `className`.
5. Iconos: `material-symbols-outlined` (ver convención más abajo), nunca SVGs
   ni otra librería de iconos.

## Tokens de diseño

Todos los tokens viven en `src/index.css`, definidos con `@theme` (Tailwind
v4) y sobrescritos para modo oscuro bajo `.dark { ... }`. El tema se activa
con la clase `.dark` en `<html>`, controlada por `useTheme` (ver
`src/hooks/useTheme.tsx`).

### Paleta de color (Material 3)

Los nombres de color siguen los **roles de color de Material 3**: cada rol
tiene una superficie (`primary`, `secondary`, `tertiary`, `error`, ...), su
contenedor (`*-container`, tono suave para fondos) y el color de contenido
sobre esa superficie (`on-*`). Uso típico:

| Rol | Base | Contenedor | Contenido (`on-*`) |
|-----|------|-----------|---------------------|
| Primary | `text-primary` / `bg-primary` | `bg-primary-container` (sidebar, botones principales) | `text-on-primary-container` |
| Secondary | `bg-secondary` | `bg-secondary-container` | `text-on-secondary-container` |
| Tertiary | `bg-tertiary` | `bg-tertiary-container` | `text-on-tertiary-container` |
| Error | `text-error` (validación, alertas) | `bg-error-container` | `text-on-error-container` |
| Semántico | `warning`, `success` — mismos valores en claro/oscuro (ya cumplen contraste AA) | — | texto blanco (`on-error`) |

**Superficies** (fondos y jerarquía de elevación): `background`, `surface`,
`surface-container-lowest` → `surface-container-highest` (de menos a más
"elevado"), `surface-variant`, `surface-dim`, `surface-bright`. Texto sobre
superficie: `on-surface`, `on-surface-variant` (texto secundario/atenuado).

**Inversos** (`inverse-surface`, `inverse-on-surface`, `inverse-primary`):
para elementos que deben leerse sobre un fondo "invertido" respecto al tema
activo (ej. un tooltip oscuro en tema claro). `surface-tint`: tono de acento
usado para simular elevación (Material 3 lo usa para tintar superficies
elevadas con el color primario).

**Roles "Fixed"** (`primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`,
`on-primary-fixed-variant` y sus equivalentes `secondary-*` / `tertiary-*`):
por especificación de Material 3 son colores que **no cambian entre tema
claro y oscuro** — de ahí el nombre "fixed". Por eso `src/index.css` no los
redefine dentro de `.dark { ... }`; sería un error hacerlo. Ejemplo real en
el código: el blob decorativo de `LoginPage.tsx` usa `bg-secondary-fixed`
precisamente porque debe verse igual sin importar el tema.

**Deshabilitado**: `disabled` (`text-disabled` / `bg-disabled`) — tiene su
propio tono por tema; no se le exige AA 4.5:1 porque WCAG exime a los
controles deshabilitados de ese requisito, pero sigue siendo legible (≥3:1)
en ambos temas.

> Todos los tokens con variante clara que necesitan un tono distinto en
> oscuro están cubiertos en `.dark { ... }` con contraste AA verificado
> (≥4.5:1 en texto, ≥3:1 en componentes grandes/iconos). Los que faltan a
> propósito son los roles "Fixed" descritos arriba.

### Tipografía

Fuente: `Hanken Grotesk` (cargada en `index.html` vía Google Fonts, con
fallback a `ui-sans-serif, system-ui, sans-serif`), token `--font-sans`.

Clases utilitarias combinadas (tamaño + interlineado + peso). Usar **la
misma clase para tamaño y color de texto** — ej. `font-headline-md
text-headline-md`:

| Clase | Tamaño / interlineado | Peso | Uso |
|-------|------------------------|------|-----|
| `headline-lg` | 32px / 40px | 700 | Título de página principal |
| `headline-md` | 24px / 32px | 600 | Título de sección / logo sidebar |
| `headline-sm` | 20px / 28px | 600 | Título de tarjeta / card |
| `body-lg` | 18px / 28px | 400 | Texto destacado |
| `body-md` | 16px / 24px | 400 | Texto de formulario / párrafo |
| `body-sm` | 14px / 20px | 400 | Texto secundario |
| `label-md` | 14px / 20px | 600 | Botones, labels de input |
| `label-sm` | 12px / 16px | 600 | Badges, ayudas, breadcrumbs |

### Radios, espaciado y layout

- Radios: `rounded` (0.25rem, default), `rounded-lg` (0.5rem, tarjetas e
  inputs), `rounded-xl` (0.75rem, contenedores de página), `rounded-full`
  (avatares, badges, iconos circulares).
- Espaciado de layout: `gap-gutter` / `p-gutter` (1.5rem, separación entre
  bloques de una página), `p-margin-mobile` (1rem) / `p-margin-desktop`
  (2.5rem, padding del `<main>` en `AppShell`), `gap-stack-gap` (1rem).
- Sidebar: `w-sidebar-expanded` (260px) / `w-sidebar-collapsed` (80px),
  sincronizado con el margen del contenido (`md:ml-sidebar-expanded` /
  `-collapsed`) para que el layout no se rompa al colapsar.
- Header: `h-header-height` (64px).

## Componentes (`src/components/ui/`)

| Componente | Propósito | Notas de uso |
|------------|-----------|--------------|
| **Toast** (`Toast.tsx`) | Notificaciones flotantes (`success` / `error` / `info`), auto-descartables a los 3s. | Se consume con `useToast().showToast(mensaje, tipo)`. Requiere `<ToastProvider>` en el árbol (ya está en `App.tsx`). |
| **EmptyState** (`EmptyState.tsx`) | Estado vacío genérico: ícono + título + descripción + acción opcional. | Usar en listas sin datos (cursos sin matricular, bandeja vacía, etc.) en vez de dejar la sección en blanco. |
| **Breadcrumbs** (`Breadcrumbs.tsx`) | Ruta de navegación jerárquica (`items: {label, to?}[]`). | El último item nunca es link (es la página actual). |
| **StatCard** (`StatCard.tsx`) | Tarjeta de métrica con ícono, valor, etiqueta, badge opcional y botón de acción. | `variant`: `primary` (CTA principal), `outline` (default), `ghost` (acción secundaria). |
| **CourseCard** (`CourseCard.tsx`) | Tarjeta de curso con imagen (con *fallback* a ícono si la imagen falla), color de acento y progreso. | Usado en `MisCursos` / `GestionCursos`. |
| **GradeTable** (`GradeTable.tsx`) | Tabla de calificaciones con estado (`calificado` / `pendiente` / `atrasado`) codificado por color. | `showStudent` muestra columna de alumno (vista docente); `editable` habilita edición de notas inline. |
| **CalendarGrid** (`CalendarGrid.tsx`) | Calendario mensual con eventos tipados (`examen` / `entrega` / `clase` / `evento`), cada tipo con su color. | Lee eventos de `mockData.CALENDAR_EVENTS`; navegación mes anterior/siguiente interna. |
| **AnnouncementsPanel** (`AnnouncementsPanel.tsx`) | Panel de anuncios: formulario de publicación (docente) + listado. | Estado local, no persiste entre recargas (prototipo). |
| **MessagesPanel** (`MessagesPanel.tsx`) | Mensajería interna estilo chat: lista de hilos + conversación activa. | Estado local por hilo (`Record<threadId, ChatMessage[]>`). |
| **ProfileForm** (`ProfileForm.tsx`) | Formulario de perfil (nombre, correo, cargo/programa, idioma) + cambio de foto. | La foto se previsualiza en el cliente con `URL.createObjectURL` (no se sube a ningún servidor); "Cancelar" revierte también la foto. |

### Layout (`src/components/layout/`)

- **AppShell**: envoltorio de página autenticada (`role`, `title`,
  `children`) — combina `Sidebar` + `Header` + `<main>` con el padding y
  scroll estándar. Toda pantalla protegida se monta dentro de un `AppShell`.
- **Sidebar**: navegación lateral por rol (`NAV_ITEMS[role]` en
  `mockData.ts`), colapsable en desktop y tipo *drawer* en móvil.
- **Header**: barra superior con título de página, toggle de sidebar/tema y
  menú de usuario.

### Auth (`src/components/auth/`)

- **PrivateRoute** (`allowedRole`): si no hay sesión redirige a `/`; si el
  rol no coincide, redirige al dashboard del rol correcto. La sesión la
  provee `useAuth` (persistida en `localStorage`, ver `README.md`).

## Convenciones

- **Iconografía**: únicamente [Material Symbols
  Outlined](https://fonts.google.com/icons) vía la clase
  `.material-symbols-outlined` (cargada como fuente variable en
  `index.html`). Para iconos "rellenos" (ej. el ícono del sidebar o el badge
  de `StatCard`) se usa `style={{ fontVariationSettings: "'FILL' 1" }}`
  inline sobre el mismo span — no hay una clase utilitaria para esto todavía.
- **Fallback de imágenes**: tanto `CourseCard` como `ProfileForm` manejan
  `onError` en el `<img>` para degradar a un ícono o a un avatar generado
  (`src/utils/avatar.tsx` → `ui-avatars.com`) en vez de mostrar una imagen
  rota — replicar este patrón en cualquier imagen que dependa de una URL
  externa o de datos mock.
- **Estado como fuente de la verdad**: no hay backend; cada pantalla mock
  gestiona su propio estado local (`useState`) inicializado desde
  `src/data/mockData.ts`. Los cambios (anuncios, mensajes, notas) no
  persisten entre recargas salvo tema (`useTheme`) y sesión (`useAuth`), que
  sí usan `localStorage`.
- **Patrón de página**: página = `AppShell` + (`Breadcrumbs` opcional) +
  composición de componentes de `ui/`. Evitar estilos ad-hoc que dupliquen un
  componente ya existente (por ejemplo, no reconstruir una tarjeta de
  métrica a mano — usar `StatCard`).
