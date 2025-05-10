import React from 'react';

type ThemeSettingsPreviewProps = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};

export function ThemeSettingsPreview({
  primaryColor,
  secondaryColor,
  fontFamily,
}: ThemeSettingsPreviewProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">主题预览</h3>
      <div className="space-y-4">
        <div>
          <div className="h-8 rounded" style={{ backgroundColor: primaryColor }} />
          <p className="text-sm mt-1">主色调</p>
        </div>
        <div>
          <div className="h-8 rounded" style={{ backgroundColor: secondaryColor }} />
          <p className="text-sm mt-1">次要色调</p>
        </div>
        <div>
          <p style={{ fontFamily }} className="text-lg">
            字体预览 - {fontFamily}
          </p>
        </div>
      </div>
    </div>
  );
} 