import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '@/types';
import { Check, RotateCcw, Palette, Sparkles, X } from 'lucide-react';
import { PRESET_THEMES } from './themes';
import { THEME_EDITOR_CONFIG } from './config';
import { Input, Button } from '@/components/ui';

interface ThemeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange, description }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
        {description && (
          <span className="block text-xs font-normal text-[var(--text-secondary)] mt-0.5">
            {description}
          </span>
        )}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-10 w-16 rounded-[var(--radius-md)] border border-[var(--border)] cursor-pointer"
        />
        <Input
          type="text"
          value={value.toUpperCase()}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
          fullWidth={false}
        />
      </div>
    </div>
  );
};

interface PresetCardProps {
  name: string;
  theme: ThemeConfig;
  onApply: () => void;
  isActive: boolean;
}

const PresetCard: React.FC<PresetCardProps> = ({ name, theme, onApply, isActive }) => {
  return (
    <button
      onClick={onApply}
      className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
        isActive
          ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
      }`}
    >
      {isActive && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
          <Check size={14} />
        </div>
      )}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-primary)] capitalize">{name}</p>
        <div className="flex gap-1">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.primary }}></div>
          <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.secondary }}></div>
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: theme.background }}
          ></div>
          <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.success }}></div>
          <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.danger }}></div>
        </div>
      </div>
    </button>
  );
};

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}) => {
  const onUpdate = onThemeChange;
  const [editedTheme, setEditedTheme] = useState<ThemeConfig>(currentTheme);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  useEffect(() => {
    setEditedTheme(currentTheme);
  }, [currentTheme, isOpen]);

  const handleColorChange = (key: keyof ThemeConfig, value: string) => {
    setEditedTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyPreset = (theme: ThemeConfig) => {
    setEditedTheme(theme);
    onUpdate(theme);
  };

  const handleSave = () => {
    onUpdate(editedTheme);
  };

  const handleReset = () => {
    const defaultTheme = THEME_EDITOR_CONFIG.defaultTheme;
    setEditedTheme(defaultTheme);
    onUpdate(defaultTheme);
  };

  const isPresetActive = (preset: ThemeConfig): boolean => {
    return JSON.stringify(preset) === JSON.stringify(currentTheme);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl h-full shadow-[var(--shadow-2xl)] flex flex-col transform transition-transform duration-300 animate-slide-in-right bg-[var(--surface)] text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between p-10 border-b-2 border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center shadow-lg">
              <Palette size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Theme Customizer</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Personalize your dashboard appearance
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="!p-2"
            aria-label="Close theme editor"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-[var(--border)]">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 px-10 py-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'presets'
                ? 'border-b-2 border-[var(--primary)] text-[var(--primary)] -mb-0.5'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highlight)]'
            }`}
          >
            <Sparkles size={16} />
            Preset Themes
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-10 py-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'custom'
                ? 'border-b-2 border-[var(--primary)] text-[var(--primary)] -mb-0.5'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highlight)]'
            }`}
          >
            <Palette size={16} />
            Custom Colors
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {activeTab === 'presets' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--primary)]" />
                  Built-in Color Palettes
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Click on any palette to instantly apply it to your dashboard
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(PRESET_THEMES).map(([name, theme]) => (
                  <PresetCard
                    key={name}
                    name={name}
                    theme={theme}
                    onApply={() => handleApplyPreset(theme)}
                    isActive={isPresetActive(theme)}
                  />
                ))}
              </div>

              <div className="mt-10 p-6 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)]">
                  💡 <strong>Tip:</strong> After selecting a preset, switch to the Custom Colors tab
                  to fine-tune individual colors.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                  Customize Individual Colors
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Fine-tune each color to match your brand or preference
                </p>
              </div>

              <div className="space-y-10">
                <div className="border-l-4 border-[var(--primary)] pl-6 space-y-6">
                  <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)]">
                    Brand Colors
                  </h4>
                  <ColorInput
                    label="Primary Color"
                    value={editedTheme.primary}
                    onChange={value => handleColorChange('primary', value)}
                    description="Main action buttons and highlights"
                  />
                  <ColorInput
                    label="Secondary Color"
                    value={editedTheme.secondary}
                    onChange={value => handleColorChange('secondary', value)}
                    description="Sidebar and secondary elements"
                  />
                </div>

                <div className="border-l-4 border-blue-400 pl-6 space-y-6">
                  <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)]">
                    Background Colors
                  </h4>
                  <ColorInput
                    label="Page Background"
                    value={editedTheme.background}
                    onChange={value => handleColorChange('background', value)}
                    description="Main page background color"
                  />
                  <ColorInput
                    label="Surface/Card Color"
                    value={editedTheme.surface}
                    onChange={value => handleColorChange('surface', value)}
                    description="Cards and elevated surfaces"
                  />
                </div>

                <div className="border-l-4 border-purple-400 pl-6 space-y-6">
                  <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)]">
                    Text Colors
                  </h4>
                  <ColorInput
                    label="Primary Text"
                    value={editedTheme.textPrimary}
                    onChange={value => handleColorChange('textPrimary', value)}
                    description="Main headings and content"
                  />
                  <ColorInput
                    label="Secondary Text"
                    value={editedTheme.textSecondary}
                    onChange={value => handleColorChange('textSecondary', value)}
                    description="Subtle text and descriptions"
                  />
                </div>

                <div className="border-l-4 border-green-400 pl-6 space-y-6">
                  <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)]">
                    UI Elements
                  </h4>
                  <ColorInput
                    label="Border Color"
                    value={editedTheme.border}
                    onChange={value => handleColorChange('border', value)}
                    description="Borders and dividers"
                  />
                  <ColorInput
                    label="Success Color"
                    value={editedTheme.success}
                    onChange={value => handleColorChange('success', value)}
                    description="Success states and positive actions"
                  />
                  <ColorInput
                    label="Danger Color"
                    value={editedTheme.danger}
                    onChange={value => handleColorChange('danger', value)}
                    description="Errors and destructive actions"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-10 p-6 rounded-xl border-2 border-dashed border-[var(--border)]">
                <h4 className="text-sm font-semibold mb-4">Live Preview</h4>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(editedTheme).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--background)] border border-[var(--border)]"
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: value }}
                      ></div>
                      <span className="text-xs font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 border-t-2 border-[var(--border)] bg-[var(--surface)] flex gap-4">
          <Button variant="ghost" onClick={handleReset} leftIcon={<RotateCcw size={16} />}>
            Reset to Default
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            leftIcon={<Check size={16} />}
            className="w-full"
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
