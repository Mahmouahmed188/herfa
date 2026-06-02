import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toBe('base visible');
  });

  it('merges tailwind classes correctly', () => {
    const result = cn('px-4', 'px-6');
    expect(result).toBe('px-6');
  });

  it('handles undefined values', () => {
    const result = cn('foo', undefined, 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });
});
