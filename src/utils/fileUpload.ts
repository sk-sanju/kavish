/**
 * Utility to read and optimize image files from local device storage
 */
export async function readImageFileAsDataUrl(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, WebP, etc.).');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Failed to read file.'));
        return;
      }

      // If SVG or small/non-raster, return directly
      if (file.type === 'image/svg+xml' || file.size < 80 * 1024) {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result); // Fallback to uncompressed
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Keep PNG transparency if PNG, otherwise use JPEG for optimal size
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        // Fallback to raw data url if canvas draw fails
        resolve(result);
      };

      img.src = result;
    };

    reader.onerror = () => {
      reject(new Error('Error reading local file.'));
    };

    reader.readAsDataURL(file);
  });
}
