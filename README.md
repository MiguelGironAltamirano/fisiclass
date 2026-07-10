# Fisiclass — Aula Virtual

Prototipo de aula virtual (LMS) para una institución universitaria. Cubre los
flujos de **estudiante** y **docente**: dashboard, cursos, calendario,
calificaciones, mensajería y perfil.

> **Estado: prototipo.** No hay backend ni base de datos — todos los datos
> (usuarios, cursos, calificaciones, mensajes, anuncios) viven en
> `src/data/mockData.ts`. El login acepta cualquier correo válido +
> contraseña de 6+ caracteres; la única credencial que falla a propósito es
> la contraseña `wrongpass`, para poder demostrar el estado de error de la UI.

## Stack

- **React 19** + **TypeScript**
- **Vite** (bundler y dev server)
- **React Router 7** (rutas y navegación protegida por rol)
- **Tailwind CSS v4** con tokens de color inspirados en **Material 3**
  (ver [`DESIGN.md`](./DESIGN.md))

## Cómo correrlo

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (Vite)
npm run build     # type-check (tsc -b) + build de producción
npm run preview   # sirve el build de producción localmente
npm run lint      # oxlint
```

## Estructura de carpetas

```
src/
├── App.tsx                  # rutas de la aplicación
├── main.tsx                 # punto de entrada (React + Router)
├── index.css                # tokens de diseño (Material 3) + Tailwind v4
├── types.ts                 # tipos compartidos (Role, Course, GradeRow, ...)
├── data/mockData.ts          # datos mock: usuarios, cursos, notas, mensajes...
├── hooks/
│   ├── useAuth.tsx           # sesión (rol) — persistida en localStorage
│   ├── useTheme.tsx          # tema claro/oscuro — persistido en localStorage
│   └── useSidebar.ts         # estado de la barra lateral (colapsada/móvil)
├── components/
│   ├── auth/PrivateRoute.tsx # guarda de rutas por rol
│   ├── layout/                # AppShell, Header, Sidebar
│   └── ui/                    # componentes reutilizables (ver DESIGN.md)
└── pages/
    ├── LoginPage.tsx / RecoveryPage.tsx   # públicas
    ├── estudiante/                        # rutas del rol estudiante
    └── docente/                           # rutas del rol docente
```

## Roles

La app tiene dos roles con rutas y menús independientes, protegidos por
`PrivateRoute`:

| Rol | Rutas base | Pantallas |
|-----|-----------|-----------|
| **Estudiante** | `/estudiante/*` | Dashboard, Mis Cursos, Módulo, Calendario, Calificaciones, Mensajes, Perfil |
| **Docente** | `/docente/*` | Dashboard, Gestión de Cursos, Calendario, Panel de Calificaciones, Mensajería/Anuncios, Perfil |

El rol activo se elige en el login (`LoginPage.tsx`) y se persiste en
`localStorage` mediante `useAuth` — al refrescar la página la sesión se
mantiene hasta hacer logout explícito.

## Documentación relacionada

- [`DESIGN.md`](./DESIGN.md) — sistema de diseño: tokens de color/tipografía,
  componentes de `src/components/ui/` y convenciones de UI.
- [`DESCRIPTION.md`](./DESCRIPTION.md) — inventario original de pantallas y
  flujos de usuario (documento de planeación, no se actualiza).
