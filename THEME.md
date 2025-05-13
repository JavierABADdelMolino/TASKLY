# 🎨 Sistema de Temas - Proyecto Taskly

Este documento describe el funcionamiento, estructura y personalización del sistema de temas claro/oscuro de la aplicación Taskly.

---

## 📁 Estructura de estilos

```bash
src/styles/
├── base/         # Reseteos, formularios, helpers globales
├── config/       # Variables SCSS base
├── components/   # Estilos SCSS específicos por componente
├── themes/       # Temas claro y oscuro
│   ├── light.scss
│   └── dark.scss
├── theme.scss    # Archivo principal de importación de Bootstrap + overrides
```

---

## 🧠 Lógica de funcionamiento

1. El tema actual se almacena en `ThemeContext` (`light` o `dark`).
2. Se aplica dinámicamente en el `data-theme` del `<html>` (`document.documentElement`).
3. Las variables CSS se definen en `light.scss` y `dark.scss`, y afectan a Bootstrap redefiniendo:

```css
--bs-body-bg
--bs-body-color
--bs-primary
--bs-tertiary-bg-rgb
--bs-body-color-rgb
...
```

4. Bootstrap utiliza estas variables para sus clases (`bg-body-tertiary`, `text-body`, etc.), lo que permite que todo el UI cambie dinámicamente de estilo.

---

## 🧩 Ejemplo de override

```scss
// light.scss
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-primary: #6366f1;

  --bs-body-bg: var(--color-bg);
  --bs-body-color: var(--color-text);
  --bs-primary: var(--color-primary);

  --bs-tertiary-bg-rgb: 255, 255, 255;
}
```

```scss
// dark.scss
[data-theme='dark'] {
  --color-bg: #111827;
  --color-text: #f9fafb;
  --color-primary: #8b5cf6;

  --bs-body-bg: var(--color-bg);
  --bs-body-color: var(--color-text);
  --bs-primary: var(--color-primary);

  --bs-tertiary-bg-rgb: 17, 24, 39;
}
```

---

## 🔧 Personalizaciones actuales

- Switch de tema (`ThemeSwitcher`) tipo Apple.
- Redefinición total de variables Bootstrap con sistema propio (`--color-*`).
- Formularios, inputs y botones adaptados con clases globales.
- Soporte completo de clases Bootstrap reactivas (`bg-body-tertiary`, `text-body`, `btn-outline-primary`, etc.).
- Scrollbar adaptado a tema (en proceso).
- Modo oscuro aún en revisión visual.

---

## ✅ Pendiente de mejorar

- Contraste en botones y textos en modo oscuro.
- Mejor visualización de inputs y modales.
- Integración con sistema de tarjetas y tareas en próximas fases.