'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, File, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUploadFile } from '../hooks/useVerification';
import { toast } from 'sonner';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;

interface VerificationDocumentsProps {
  mode: 'single' | 'multiple';
  label: string;
  accept?: string;
  maxSize?: number;
  onUpload: (url: string | string[]) => void;
  existingUrl?: string;
  multiple?: boolean;
}

export function VerificationDocuments({
  mode,
  label,
  accept = 'image/jpeg,image/png,application/pdf',
  maxSize = MAX_SIZE,
  onUpload,
  existingUrl,
  multiple = false,
}: VerificationDocumentsProps) {
  const t = useTranslations('Verification');
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadFile();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; name: string }>>(
    existingUrl ? [{ url: existingUrl, name: existingUrl.split('/').pop() || 'file' }] : []
  );
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return t('invalidFormat');
    }
    if (file.size > maxSize) {
      return t('fileTooLarge');
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadMutation.mutateAsync({
        file,
        onProgress: (percent) => setProgress(percent),
      });

      if (mode === 'single') {
        setUploadedFiles([{ url: result.url, name: file.name }]);
        onUpload(result.url);
      } else {
        const newFile = { url: result.url, name: file.name };
        setUploadedFiles((prev) => {
          const updated = [...prev, newFile];
          onUpload(updated.map((f) => f.url));
          return updated;
        });
      }
      toast.success(t('uploadSuccess'));
    } catch {
      toast.error(t('uploadFailed'));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    Array.from(files).forEach((file) => handleUpload(file));
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (mode === 'single') {
        onUpload('');
      } else {
        onUpload(updated.map((f) => f.url));
      }
      return updated;
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors',
          'hover:border-primary/50 hover:bg-muted/50 cursor-pointer',
          uploading && 'pointer-events-none opacity-60'
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <div className="w-full max-w-xs">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{t('uploadProgress')} {progress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">{t('upload')}</span>
              {' JPEG, PNG, PDF - max 5MB'}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
