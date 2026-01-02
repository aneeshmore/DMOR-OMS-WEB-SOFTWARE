// Re-export from themes
export { DEFAULT_THEME, PRESET_THEMES } from './themes';

export const UNIT_MAP: Record<number, string> = {
  1: 'Nos',
  2: 'ml',
  3: 'Ltr',
  4: 'Kg',
  5: 'gm',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
