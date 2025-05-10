import React from 'react';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

interface ThemeSettingsPreviewProps {
  settings: ThemeSettings;
}

export function SpecificSettingPreview({ setting, value }: { setting: string; value: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{setting}</h3>
      <div className="p-4 bg-gray-100 rounded" style={{ [setting]: value }}>
        Preview
      </div>
    </div>
  );
}

export function ThemeSettingsPreview({ settings }: ThemeSettingsPreviewProps) {
  return (
    <div className="space-y-4">
      <SpecificSettingPreview setting="color" value={settings.primaryColor} />
      <SpecificSettingPreview setting="backgroundColor" value={settings.secondaryColor} />
      <SpecificSettingPreview setting="fontFamily" value={settings.fontFamily} />
      <SpecificSettingPreview setting="borderRadius" value={settings.borderRadius} />
      <SpecificSettingPreview setting="padding" value={settings.spacing} />
    </div>
  );
} 