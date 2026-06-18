'use client';

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function StarRating({ rating, maxRating = 5, size = 'md', className, showValue }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} dir="ltr">
      {Array.from({ length: fullStars }, (_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(sizeMap[size], 'fill-yellow-400 text-yellow-400')}
          aria-hidden="true"
        />
      ))}
      {hasHalfStar && (
        <span className="relative" aria-hidden="true">
          <Star className={cn(sizeMap[size], 'text-yellow-400')} />
          <StarHalf className={cn(sizeMap[size], 'fill-yellow-400 text-yellow-400 absolute inset-0')} />
        </span>
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeMap[size], 'text-muted-foreground/30')}
          aria-hidden="true"
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground" aria-label={`${rating} out of ${maxRating}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
