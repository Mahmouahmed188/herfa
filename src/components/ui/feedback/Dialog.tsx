'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * A reusable Dialog (Modal) component using Framer Motion.
 * Aligns with the "Shared Component Architecture" of the constitution.
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={cn(
                'pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-xl border bg-background p-6 shadow-lg outline-none',
                className
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
                  {description && <p className="text-sm text-muted-foreground mt-1.5">{description}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="py-2">{children}</div>

              {footer && (
                <div className="flex items-center justify-end gap-2 mt-6">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
