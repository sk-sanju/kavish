/**
 * Utility functions for optimizing image delivery, responsive sizing, and fallback handling.
 */

// Fallback high quality lightweight placeholder image for Kerala handlooms
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=75';

/**
 * Optimizes an image URL (Unsplash, Supabase, Cloudinary) to a specific width and quality with modern WebP formatting.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: 'crop' | 'clip' | 'fill';
  } = {}
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return FALLBACK_IMAGE;
  }

  const cleanUrl = url.trim();

  // If it's a data URL or blob, return as is
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // Handle Unsplash images
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(cleanUrl);
      const width = options.width || 800;
      const quality = options.quality || 75;
      const fit = options.fit || 'crop';

      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', fit);
      parsed.searchParams.set('w', String(width));
      if (options.height) {
        parsed.searchParams.set('h', String(options.height));
      }
      parsed.searchParams.set('q', String(quality));

      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}

/**
 * Graceful image error handler that replaces failed image sources with a resilient fallback.
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
