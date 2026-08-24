/**
 * Utility to read and optimize image files from local device storage
 */
const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.bmp', '.avif', '.jfif', '.heic'];

function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) return true;
  const fileName = (file.name || '').toLowerCase();
  return VALID_IMAGE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

export async function readImageFileAsDataUrl(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<string> {
  if (!isImageFile(file)) {
    throw new Error(`"${file.name || 'File'}" is not a supported image (JPG, PNG, WebP, SVG, etc.).`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Could not read file content.'));
        return;
      }

      // If SVG or small file (< 100KB), return directly as Data URL
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg') || file.size < 100 * 1024) {
        resolve(result);
        return;
      }

      // Use HTML Image element to compress / scale large device photos
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          if (width <= maxWidth && height <= maxHeight && file.size < 300 * 1024) {
            resolve(result);
            return;
          }

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(result);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
          const mimeType = isPng ? 'image/png' : 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl || result);
        } catch {
          resolve(result);
        }
      };

      img.onerror = () => {
        // If image decode fails in browser, still resolve raw base64 data URL
        resolve(result);
      };

      img.src = result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read device file.'));
    };

    reader.readAsDataURL(file);
  });
}

