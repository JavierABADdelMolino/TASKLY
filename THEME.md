# 🎨 Sistema de Temas - Proyecto Taskly

Este documento describe el funcionamiento, estructura y personalización del sistema de temas claro/oscuro de la aplicación Taskly.

---

## 📁 Estructura actual de estilos

```bash
src/styles/
├── base/         # Reset, helpers globales
├── config/       # Variables SCSS
├── components/   # Estilos específicos por componente
├── themes/       # Archivos de tema claro y oscuro (vacíos actualmente)
│   ├── light.scss        # ⚠️ Pendiente de implementar
│   └── dark.scss         # ⚠️ Pendiente de implementar
├── theme.scss    # Archivo central que importa Bootstrap + override básico
```

---

## 🧠 Estado actual del sistema de temas

Actualmente, `theme.scss` es el único archivo activo. Este:

- Importa Bootstrap.
- Puede incluir `@import` de `base/`, `config/` o `components/`.
- No aplica aún variables dinámicas para modo claro/oscuro.

```scss
// src/styles/theme.scss
@import "bootstrap/scss/bootstrap";
@import "./base/reset";
@import "./config/variables";
// etc.
```

---

## 📌 Plan futuro para tematización completa

1. Implementar dos temas reales (`light.scss`, `dark.scss`) que redefinan variables CSS como:

```scss
:root {
  --bs-body-bg: #fff;
  --bs-body-color: #111;
  --bs-primary: #6366f1;
  ...
}

[data-theme='dark'] {
  --bs-body-bg: #111;
  --bs-body-color: #eee;
  --bs-primary: #8b5cf6;
  ...
}
```

2. Separar colores y tokens personalizados en `config/variables.scss`.
3. Integrar selectores condicionales (`[data-theme='dark']`) para adaptar formularios, botones y modales.

---

## 🔧 Situación actual

- No hay variables dinámicas aún.
- No se aplican los temas `light.scss` ni `dark.scss` (están vacíos).
- Se usa Bootstrap tal cual, con pequeños overrides si acaso en `config/`.

---

## ✅ Próximos pasos

- Completar definición de colores personalizados (`--color-*`) y mapearlos a `--bs-*`.
- Aplicar estas definiciones en `light.scss` y `dark.scss`.
- Confirmar que `ThemeContext` cambia `data-theme` correctamente.
- Adaptar componentes visuales a esas variables para que se actualicen con el tema.

