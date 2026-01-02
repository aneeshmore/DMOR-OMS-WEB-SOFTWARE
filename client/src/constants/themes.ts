/**
 * Application Constants
 *
 * Note: Theme-related constants have been moved to /plugins/themeEditor
 * Import from there if you need theme presets or default theme.
 */

export const UNIT_MAP: Record<number, string> = {
  1: 'Nos',
  2: 'ml',
  3: 'Ltr',
  4: 'Kg',
  5: 'gm',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Re-export theme utilities for backward compatibility
export { PRESET_THEMES } from '@/plugins/themeEditor/themes';
export { THEME_EDITOR_CONFIG } from '@/plugins/themeEditor/config';
export { isThemeEditorEnabled as THEME_EDITOR_ENABLED } from '@/plugins/themeEditor';

// Default theme for backward compatibility
import { THEME_EDITOR_CONFIG } from '@/plugins/themeEditor/config';
export const DEFAULT_THEME = THEME_EDITOR_CONFIG.defaultTheme;
