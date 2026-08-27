/**
 * High-performance image optimization utility.
 * Supports Unsplash CDN, Supabase Storage transforms, Cloudinary, and responsive WebP formats.
 */

// Lightweight high quality fallback placeholder image (Kerala handlooms)
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=70&fm=webp';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'crop' | 'clip' | 'fill' | 'cover';
  format?: 'webp' | 'auto';
}

/**
 * Optimizes an image URL to modern WebP with explicit width, height, and quality constraints.
 * Drastically reduces data payload and speeds up page paints.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return FALLBACK_IMAGE;
  }

  const cleanUrl = url.trim();

  // If already data URL or blob, return as is
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  const width = options.width || 600;
  const quality = options.quality || 75;
  const fit = options.fit || 'crop';

  // 1. Handle Unsplash CDN Images
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(cleanUrl);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', fit);
      parsed.searchParams.set('w', String(width));
      if (options.height) {
        parsed.searchParams.set('h', String(options.height));
      }
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('fm', 'webp');
      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  // 2. Handle Supabase Storage Transformations
  // Converts /storage/v1/object/public/ to /storage/v1/render/image/public/ if applicable
  if (cleanUrl.includes('/storage/v1/object/public/')) {
    try {
      const renderUrl = cleanUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      const parsed = new URL(renderUrl);
      parsed.searchParams.set('width', String(width));
      parsed.searchParams.set('quality', String(quality));
      if (options.height) {
        parsed.searchParams.set('height', String(options.height));
      }
      parsed.searchParams.set('resize', fit === 'clip' ? 'contain' : 'cover');
      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  // 3. Handle Cloudinary CDN Images
  if (cleanUrl.includes('res.cloudinary.com')) {
    try {
      const parts = cleanUrl.split('/upload/');
      if (parts.length === 2) {
        const transformParams = `w_${width},q_${quality},f_webp,c_${fit === 'clip' ? 'fit' : 'fill'}`;
        return `${parts[0]}/upload/${transformParams}/${parts[1]}`;
      }
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}

/**
 * Generates responsive srcset for responsive cards
 */
export function getOptimizedSrcSet(
  url: string | undefined | null,
  widths: number[] = [320, 480, 768, 1024]
): string {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
    return '';
  }

  return widths
    .map(w => `${getOptimizedImageUrl(url, { width: w, quality: 75 })} ${w}w`)
    .join(', ');
}

/**
 * Graceful image error handler that replaces broken image sources with the resilient fallback.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = FALLBACK_IMAGE
) {
  const target = event.currentTarget;
  if (target && target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
}
