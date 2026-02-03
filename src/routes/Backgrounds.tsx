import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '@/hooks/usePreferences';
import { setGradient, setBackgroundImage, setCustomGradient } from '@/storage/preferences';
import { GradientGrid } from '@/components/backgrounds/GradientGrid';
import { ImageUploader } from '@/components/backgrounds/ImageUploader';
import { CustomGradientEditor } from '@/components/backgrounds/CustomGradientEditor';

export function Backgrounds() {
  const prefs = usePreferences();
  const navigate = useNavigate();
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  const handleSelectGradient = (gradientId: string) => {
    setGradient(gradientId);
    navigate('/');
  };

  const handleCustomSave = (color1: string, color2: string) => {
    setCustomGradient(color1, color2);
    setShowCustomEditor(false);
    navigate('/');
  };

  const handleImageUpload = (dataUrl: string) => {
    setBackgroundImage(dataUrl);
    navigate('/');
  };

  const handleImageRemove = () => {
    setBackgroundImage(null);
  };

  if (showCustomEditor) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--color-bg-primary)]">
        <div className="px-4 pt-[env(safe-area-inset-top)] mt-3">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Custom Gradient</h1>
          <CustomGradientEditor
            initialColor1={prefs.customGradient?.color1}
            initialColor2={prefs.customGradient?.color2}
            onSave={handleCustomSave}
            onCancel={() => setShowCustomEditor(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--color-bg-primary)]">
      <div className="px-4 pt-[env(safe-area-inset-top)] mt-3 pb-4 flex flex-col gap-5">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Backgrounds</h1>

        {/* Gradient presets */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Gradient Presets</h2>
          <GradientGrid
            selectedId={prefs.backgroundType === 'image' ? '' : prefs.gradientId}
            onSelect={handleSelectGradient}
            onCustomClick={() => setShowCustomEditor(true)}
          />
        </div>

        {/* Image upload */}
        <ImageUploader
          currentImage={prefs.backgroundImage}
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
        />
      </div>
    </div>
  );
}
