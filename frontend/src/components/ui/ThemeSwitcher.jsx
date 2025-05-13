// src/components/ThemeSwitcher.jsx
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher form-check form-switch ms-3">
      <input
        className="form-check-input"
        type="checkbox"
        id="themeSwitch"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <label className="form-check-label" htmlFor="themeSwitch"></label>
    </div>
  );
};

export default ThemeSwitcher;
