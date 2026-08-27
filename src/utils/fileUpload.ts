import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Utility to compress, optimize, and upload image files
 */
const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.bmp', '.avif', '.jfif', '.heic'];

function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) return true;
  const fileName = (file.name || '').toLowerCase();
  return VALID_IMAGE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

/**
 * Compresses an image File to an optimized Blob (WebP/JPEG) with max resolution constraints.
 */
export async function compressImageToBlob(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<{ blob: Blob; mimeType: string }> {
  // If SVG or very small, keep as is
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg') || file.size < 50 * 1024) {
    return { blob: file, mimeType: file.type || 'image/jpeg' };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
        return;
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
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
          resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Prefer modern WebP format
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, mimeType: 'image/webp' });
            } else {
              // Fallback to JPEG
              canvas.toBlob(
                (fallbackBlob) => {
                  resolve({ blob: fallbackBlob || file, mimeType: 'image/jpeg' });
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
      };

      img.src = src;
    };

    reader.onerror = () => {
      resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
    };

    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(
  file: File,
  folder = 'uploads',
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  if (!isImageFile(file)) {
    throw new Error(`"${file.name || 'File'}" is not a supported image (JPG, PNG, WebP, SVG, etc.).`);
  }

  // Pre-compress file into lightweight WebP/JPEG blob
  let uploadBlob: Blob = file;
  let fileExt = file.name.split('.').pop() || 'jpg';
  let mimeType = file.type || 'image/jpeg';

  try {
    const compressed = await compressImageToBlob(file, maxWidth, maxHeight, quality);
    uploadBlob = compressed.blob;
    mimeType = compressed.mimeType;
    fileExt = mimeType.includes('webp') ? 'webp' : 'jpg';
  } catch (err) {
    console.warn('Image pre-compression fallback:', err);
  }

  // 1. Try uploading to Supabase Storage bucket 'store-media'
  if (isSupabaseConfigured) {
    try {
      const cleanFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('store-media')
        .upload(cleanFileName, uploadBlob, {
          cacheControl: '31536000', // 1 year immutable cache
          upsert: true,
          contentType: mimeType
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('store-media')
          .getPublicUrl(cleanFileName);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload fallback:', storageErr);
    }
  }

  // 2. Fallback: Compress image to compact Data URL
  return readImageFileAsDataUrl(file, maxWidth, maxHeight, quality);
}

export async function readImageFileAsDataUrl(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
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

      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg') || file.size < 50 * 1024) {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

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

          // Try WebP first for smallest data payload
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          if (webpDataUrl && webpDataUrl.startsWith('data:image/webp')) {
            resolve(webpDataUrl);
            return;
          }

          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegDataUrl || result);
        } catch {
          resolve(result);
        }
      };

      img.onerror = () => {
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
