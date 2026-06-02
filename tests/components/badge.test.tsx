import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Badge variant="destructive">Suspended</Badge>);
    const badge = screen.getByText('Suspended');
    expect(badge.className).toContain('destructive');
  });
});
