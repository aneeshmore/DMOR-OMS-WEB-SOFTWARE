/**
 * Theme Hook
 *
 * React hook for theme management
 */

import { useState, useEffect } from "react";
import { ThemeConfig } from "@/types";
import { themeManager } from "./themeManager";
import { isThemeEditorEnabled } from "./config";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    if (!isThemeEditorEnabled()) {
      // If theme editor is disabled, just return default theme
      return themeManager.loadTheme();
    }
    return themeManager.loadTheme();
  });

  useEffect(() => {
    // Apply theme to DOM whenever it changes
    themeManager.applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeConfig) => {
    if (!isThemeEditorEnabled()) {
      console.warn(
        "Theme editor is disabled. Theme changes will not be saved."
      );
      return;
    }

    setThemeState(newTheme);
    themeManager.saveTheme(newTheme);
  };

  const resetTheme = () => {
    if (!isThemeEditorEnabled()) {
      console.warn("Theme editor is disabled.");
      return;
    }

    const defaultTheme = themeManager.resetTheme();
    setThemeState(defaultTheme);
  };

  return {
    theme,
    setTheme,
    resetTheme,
    isEnabled: isThemeEditorEnabled(),
  };
}
