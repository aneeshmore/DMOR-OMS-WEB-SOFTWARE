/**
 * Theme Editor Plugin
 *
 * Export all theme editor functionality from a single entry point.
 * This makes it easy to remove the entire plugin by deleting this folder.
 */

export {
  THEME_EDITOR_CONFIG,
  isThemeEditorEnabled,
  logThemeEditor,
} from "./config";
export { PRESET_THEMES } from "./themes";
export { ThemeManager, themeManager } from "./themeManager";
export { useTheme } from "./useTheme";

// Re-export ThemeEditor component
export { ThemeEditor } from "./ThemeEditor";
