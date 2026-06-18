'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  label?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

export function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = 'md',
  disabled = false,
  error,
  label,
}: StarRatingInputProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const current = hoveredRating || value;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.min(current + 1, maxRating);
        setHoveredRating(next);
        onChange(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        const prev = Math.max(current - 1, 0);
        setHoveredRating(prev);
        onChange(prev);
      }
    },
    [disabled, hoveredRating, maxRating, onChange, value]
  );

  const displayRating = hoveredRating || value;

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div
        className={cn('inline-flex items-center gap-1', {
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer': !disabled,
        })}
        role="radiogroup"
        aria-label={label || 'Rating'}
        dir="ltr"
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;
          return (
            <button
              key={starValue}
              type="button"
              disabled={disabled}
              className={cn(
                'transition-transform focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm',
                !disabled && 'hover:scale-110'
              )}
              onClick={() => {
                if (!disabled) {
                  const newValue = starValue === value ? 0 : starValue;
                  onChange(newValue);
                }
              }}
              onMouseEnter={() => !disabled && setHoveredRating(starValue)}
              onMouseLeave={() => !disabled && setHoveredRating(0)}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
              aria-checked={starValue === value}
              role="radio"
            >
              <Star
                className={cn(
                  sizeMap[size],
                  'transition-colors',
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-muted-foreground/30'
                )}
              />
            </button>
          );
        })}
        {displayRating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground" aria-live="polite">
            {displayRating} / {maxRating}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
