/**
 * High-performance image optimization utility.
 * Supports Unsplash CDN, Supabase Storage transforms, Cloudinary, and responsive WebP/AVIF formats.
 */

// Lightweight high quality fallback placeholder image (Kerala handlooms)
export const FALLBACK_IMAGE = '/assets/banners/hero_kavish.jpg';

export type ImagePreset = 'thumbnail' | 'card' | 'detail' | 'banner' | 'avatar' | 'custom';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'crop' | 'clip' | 'fill' | 'cover' | 'contain';
  format?: 'webp' | 'avif' | 'origin' | 'auto';
  preset?: ImagePreset;
}

export const PRESET_CONFIGS: Record<Exclude<ImagePreset, 'custom'>, { width: number; quality: number; widths: number[] }> = {
  avatar: {
    width: 96,
    quality: 80,
    widths: [64, 96, 128]
  },
  thumbnail: {
    width: 200,
    quality: 75,
    widths: [120, 160, 200, 280]
  },
  card: {
    width: 500,
    quality: 75,
    widths: [320, 480, 600, 768]
  },
  detail: {
    width: 1000,
    quality: 80,
    widths: [600, 900, 1200, 1600]
  },
  banner: {
    width: 1400,
    quality: 80,
    widths: [768, 1024, 1400, 1920]
  }
};

/**
 * Optimizes an image URL to modern WebP with explicit width, height, and quality constraints.
 * Drastically reduces data payload, eliminates layout shift, and accelerates page paints.
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

  // Preserve SVG vector graphics without raster transformation
  if (cleanUrl.toLowerCase().endsWith('.svg') || cleanUrl.includes('.svg?')) {
    return cleanUrl;
  }

  // Resolve preset defaults
  let targetWidth = options.width;
  let targetQuality = options.quality;

  if (options.preset && options.preset !== 'custom' && PRESET_CONFIGS[options.preset]) {
    const presetConf = PRESET_CONFIGS[options.preset];
    if (!targetWidth) targetWidth = presetConf.width;
    if (!targetQuality) targetQuality = presetConf.quality;
  }

  const width = targetWidth || 600;
  const quality = targetQuality || 75;
  const fit = options.fit || 'crop';
  const format = options.format || 'webp';

  // 1. Handle Unsplash CDN Images
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(cleanUrl);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', fit === 'cover' ? 'crop' : fit);
      parsed.searchParams.set('w', String(width));
      if (options.height) {
        parsed.searchParams.set('h', String(options.height));
      }
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('fm', format === 'origin' ? 'jpg' : format);
      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  // 2. Handle Supabase Storage Transformations
  // Converts /storage/v1/object/public/ to /storage/v1/render/image/public/
  if (cleanUrl.includes('/storage/v1/object/public/')) {
    try {
      const renderUrl = cleanUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      const parsed = new URL(renderUrl);
      parsed.searchParams.set('width', String(width));
      parsed.searchParams.set('quality', String(quality));
      if (options.height) {
        parsed.searchParams.set('height', String(options.height));
      }
      parsed.searchParams.set('resize', fit === 'clip' || fit === 'contain' ? 'contain' : 'cover');
      if (format !== 'auto') {
        parsed.searchParams.set('format', format);
      }
      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  // If URL is already a Supabase render URL, update query parameters
  if (cleanUrl.includes('/storage/v1/render/image/public/')) {
    try {
      const parsed = new URL(cleanUrl);
      parsed.searchParams.set('width', String(width));
      parsed.searchParams.set('quality', String(quality));
      if (options.height) {
        parsed.searchParams.set('height', String(options.height));
      }
      parsed.searchParams.set('resize', fit === 'clip' || fit === 'contain' ? 'contain' : 'cover');
      if (format !== 'auto') {
        parsed.searchParams.set('format', format);
      }
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
        const cFit = fit === 'clip' || fit === 'contain' ? 'fit' : 'fill';
        const transformParams = `w_${width},q_${quality},f_${format},c_${cFit}`;
        return `${parts[0]}/upload/${transformParams}/${parts[1]}`;
      }
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}

/**
 * Generates responsive srcset for responsive cards and high-DPI displays
 */
export function getOptimizedSrcSet(
  url: string | undefined | null,
  widthsOrPreset: number[] | ImagePreset = [320, 480, 640, 800, 1024]
): string {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
    return '';
  }

  // Preserve SVG without srcset
  if (url.toLowerCase().endsWith('.svg') || url.includes('.svg?')) {
    return '';
  }

  let widths: number[];
  if (typeof widthsOrPreset === 'string' && widthsOrPreset !== 'custom' && PRESET_CONFIGS[widthsOrPreset]) {
    widths = PRESET_CONFIGS[widthsOrPreset].widths;
  } else if (Array.isArray(widthsOrPreset)) {
    widths = widthsOrPreset;
  } else {
    widths = [320, 480, 640, 800, 1024];
  }

  return widths
    .map(w => `${getOptimizedImageUrl(url, { width: w, quality: 75, format: 'webp' })} ${w}w`)
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
