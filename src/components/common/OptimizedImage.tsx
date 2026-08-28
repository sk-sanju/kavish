import React, { useState, useEffect, useMemo } from 'react';
import {
  getOptimizedImageUrl,
  getOptimizedSrcSet,
  FALLBACK_IMAGE,
  type ImagePreset
} from '../../utils/imageOptimizer';

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  preset?: ImagePreset;
  priority?: boolean;
  aspectRatio?: '3/4' | '1/1' | '16/9' | '16/10' | '4/3' | 'auto' | string;
  containerClassName?: string;
  imageClassName?: string;
  quality?: number;
  fallbackSrc?: string;
  fit?: 'cover' | 'contain' | 'crop' | 'clip';
  showSkeleton?: boolean;
}

const DEFAULT_SIZES: Record<ImagePreset, string> = {
  avatar: '96px',
  thumbnail: '(max-width: 640px) 80px, 160px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw',
  detail: '(max-width: 1024px) 100vw, 60vw',
  banner: '100vw',
  custom: '100vw'
};

const ASPECT_RATIO_CLASSES: Record<string, string> = {
  '3/4': 'aspect-[3/4]',
  '1/1': 'aspect-square',
  '16/9': 'aspect-[16/9]',
  '16/10': 'aspect-[16/10]',
  '4/3': 'aspect-[4/3]',
  'auto': ''
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  preset = 'card',
  priority = false,
  aspectRatio = 'auto',
  containerClassName = '',
  imageClassName = '',
  className = '',
  quality,
  fallbackSrc = FALLBACK_IMAGE,
  fit = 'cover',
  sizes,
  width,
  height,
  showSkeleton = true,
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const targetSrc = hasError || !src ? fallbackSrc : src;

  // Optimized base URL and responsive srcSet
  const optimizedUrl = useMemo(() => {
    return getOptimizedImageUrl(targetSrc, {
      preset,
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
      quality,
      fit
    });
  }, [targetSrc, preset, width, height, quality, fit]);

  const computedSrcSet = useMemo(() => {
    if (hasError || !src || targetSrc.startsWith('data:') || targetSrc.startsWith('blob:')) {
      return undefined;
    }
    return getOptimizedSrcSet(targetSrc, preset);
  }, [targetSrc, preset, hasError, src]);

  const computedSizes = sizes || DEFAULT_SIZES[preset] || '100vw';

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e as any);
    }
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setIsLoaded(true);
    }
    if (onError) {
      onError(e as any);
    }
  };

  const aspectClass = ASPECT_RATIO_CLASSES[aspectRatio] ?? (aspectRatio !== 'auto' ? `aspect-[${aspectRatio}]` : '');

  // Attributes for high-performance priority loading vs lazy loading
  const loadingAttr = priority ? 'eager' : 'lazy';
  const decodingAttr = priority ? 'sync' : 'async';
  // @ts-ignore fetchpriority is standard in modern HTML/React 18.3+
  const fetchPriorityAttr = priority ? 'high' : 'auto';

  // Meaningful accessible alt text
  const cleanAlt = alt && alt.trim().length > 0 ? alt.trim() : "Artisanal handloom garment by Kavish";

  return (
    <div
      className={`relative overflow-hidden bg-[#FAF8F1] ${aspectClass} ${containerClassName}`}
      style={!aspectClass && aspectRatio && aspectRatio !== 'auto' ? { aspectRatio } : undefined}
    >
      {/* Lightweight Shimmer Skeleton Placeholder */}
      {showSkeleton && !isLoaded && (
        <div
          className="absolute inset-0 bg-[#F2EDE2] animate-pulse z-0 pointer-events-none"
          aria-hidden="true"
        />
      )}

      <img
        src={optimizedUrl}
        srcSet={computedSrcSet}
        sizes={computedSizes}
        alt={cleanAlt}
        loading={loadingAttr}
        decoding={decodingAttr}
        // @ts-ignore
        fetchpriority={fetchPriorityAttr}
        onLoad={handleImgLoad}
        onError={handleImgError}
        className={`w-full h-full object-${fit} transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imageClassName} ${className}`}
        width={width}
        height={height}
        {...rest}
      />
    </div>
  );
};
