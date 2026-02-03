import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { usePremium } from '@/hooks/usePremium';

interface ImageUploaderProps {
  currentImage: string | null;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}

export function ImageUploader({ currentImage, onUpload, onRemove }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isPremiumUser = usePremium();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Background Image</h3>
        {!isPremiumUser && <Badge variant="premium">PRO</Badge>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (isPremiumUser) inputRef.current?.click();
          }}
          disabled={!isPremiumUser}
        >
          Upload Image
        </Button>

        {currentImage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
          >
            Remove
          </Button>
        )}
      </div>

      {currentImage && (
        <div className="w-full h-20 rounded-xl overflow-hidden border border-[var(--color-border)]">
          <img src={currentImage} alt="Background" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}
