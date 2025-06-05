# 🎨 Sistema de Temas - Proyecto Taskly

Este documento describe el sistema de temas claro/oscuro implementado en Taskly, basado en variables CSS y SCSS.

---

## 📁 Estructura de estilos relevante

```
frontend/src/styles/
├── base/                   # Reset, utilidades globales
├── config/                 # Definición de variables SCSS y CSS (--bs-*)
│   └── _variables.scss     # Variables de marca y mapeo a --bs-*
├── components/             # Overrides específicos de componentes (modals, forms)
├── themes/                 # Temas dinámicos
│   ├── _light.scss         # Definiciones de CSS vars para modo claro
│   └── _dark.scss          # Definiciones de CSS vars para modo oscuro
└── index.scss              # Punto de entrada central que importa config, Bootstrap, base y temas
```

---

## ⚙️ Mapeo de variables y Bootstrap

En `config/_variables.scss` se declaran variables SCSS y CSS globals:

```scss
:root {
  --bs-body-bg: #f5f7fa;
  --bs-body-color: #333333;
  --bs-primary: #1abc9c;
  --bs-secondary: #e74c3c;
  --bs-border-color: #dee2e6;
  --bs-hover-bg: rgba(26,188,156,0.1);
  /* y más tokens de marca... */
}
```

Luego, en `themes/_light.scss` y `themes/_dark.scss` se redefinen las mismas variables CSS dentro del selector `[data-theme='light']` y `[data-theme='dark']`, respectivamente. Esto permite que Bootstrap y nuestros estilos respondan automáticamente al tema activo.

---

## 💻 Integración en React

- El `ThemeContext` inicializa el tema leyendo la preferencia manual en **sessionStorage** o, en ausencia de esta, el valor de `user.theme`.
- Al cambiar el tema, se persiste la elección en **sessionStorage** (se reemplaza `localStorage`).
- Cada vez que cambia, el hook React aplica el atributo `data-theme="<light|dark>"` al elemento `<html>`.
- El sistema de estilos central (`index.scss`) importa Bootstrap, variables globales (`_variables.scss`) y los temas dinámicos (`_light.scss` y `_dark.scss`).
- Formularios, modales y componentes (e.g. BoardCard, ColumnCard, TaskCard) adaptan colores automáticamente vía variables CSS.
- El `ThemeSwitcher` en la Navbar permite cambiar de tema en cualquier página y mantiene la persistencia mientras la sesión del navegador esté abierta.

---

## 🛠️ Cómo añadir y customizar colores

1. En `config/_variables.scss`, ajusta tus colores de marca (primary, secondary, etc.).
2. En `themes/_light.scss` y `themes/_dark.scss`, redefine los valores de fondo, texto, bordes y componentes:
   ```scss
   [data-theme='dark'] {
     --bs-body-bg: #121212;
     --bs-body-color: #e0e0e0;
     --bs-card-bg: #1e1e1e;
     /* reglas específicas de componentes */
   }
   ```
3. Agrega overrides puntuales en `components/` si necesitas adaptar widgets concretos.

---

## ✅ Buenas prácticas

- Usa siempre las variables CSS (`var(--bs-*)`) en lugar de colores hard-coded.
- Al crear nuevos componentes o modales, verifica en ambos temas.
- Mantén la lista de tokens (`--bs-primary`, `--bs-hover-bg`, etc.) sincronizada en ambos archivos de tema.

---

*(Este documento se mantiene actualizado con los cambios de diseño y accesibilidad del sistema de temas.)*

