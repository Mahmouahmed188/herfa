'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubmitVerification } from '../hooks/useVerification';
import { VerificationDocuments } from './VerificationDocuments';
import { toast } from 'sonner';

const submissionSchema = z.object({
  frontIdImage: z.string().min(1, 'Front ID image is required'),
  backIdImage: z.string().min(1, 'Back ID image is required'),
  personalPhoto: z.string().min(1, 'Personal photo is required'),
  documents: z.array(z.string()).min(1, 'At least one document is required'),
  portfolio: z.array(z.string()),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface VerificationSubmissionFormProps {
  existingStatus?: {
    status: string;
    frontIdImage?: string;
    backIdImage?: string;
    personalPhoto?: string;
    documents?: Array<{ id: string; type: string; url: string }>;
    portfolio?: string[];
  };
}

export function VerificationSubmissionForm({ existingStatus }: VerificationSubmissionFormProps) {
  const t = useTranslations('Verification');
  const submitMutation = useSubmitVerification();
  const [uploadedUrls, setUploadedUrls] = React.useState<Record<string, string | string[]>>({});
  const [documentUrls, setDocumentUrls] = React.useState<string[]>([]);
  const [portfolioUrls, setPortfolioUrls] = React.useState<string[]>([]);

  const methods = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      frontIdImage: existingStatus?.frontIdImage || '',
      backIdImage: existingStatus?.backIdImage || '',
      personalPhoto: existingStatus?.personalPhoto || '',
      documents: [],
      portfolio: [],
    },
  });

  const { handleSubmit, setError, setValue, formState: { errors } } = methods;

  React.useEffect(() => {
    const front = uploadedUrls.front;
    const back = uploadedUrls.back;
    const photo = uploadedUrls.photo;
    if (typeof front === 'string') setValue('frontIdImage', front);
    if (typeof back === 'string') setValue('backIdImage', back);
    if (typeof photo === 'string') setValue('personalPhoto', photo);
  }, [uploadedUrls, setValue]);

  React.useEffect(() => {
    setValue('documents', documentUrls);
  }, [documentUrls, setValue]);

  React.useEffect(() => {
    setValue('portfolio', portfolioUrls);
  }, [portfolioUrls, setValue]);

  const onSubmit = async (data: SubmissionFormData) => {
    try {
      await submitMutation.mutateAsync(data);
      toast.success(t('submitted'));
    } catch (err: unknown) {
      const apiErr = err as { error?: { fields?: Record<string, string[]>; message?: string } };
      if (apiErr?.error?.fields) {
        Object.entries(apiErr.error.fields).forEach(([field, messages]) => {
          setError(field as keyof SubmissionFormData, {
            message: (messages as string[])[0],
          });
        });
      }
      if (apiErr?.error?.message) {
        toast.error(apiErr.error.message);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t('uploadDocuments')}</h2>
          <VerificationDocuments
            mode="single"
            label="Front ID Image"
            accept="image/jpeg,image/png,application/pdf"
            maxSize={5 * 1024 * 1024}
            onUpload={(url) => setUploadedUrls((prev) => ({ ...prev, front: url }))}
            existingUrl={existingStatus?.frontIdImage}
          />
          <VerificationDocuments
            mode="single"
            label="Back ID Image"
            accept="image/jpeg,image/png,application/pdf"
            maxSize={5 * 1024 * 1024}
            onUpload={(url) => setUploadedUrls((prev) => ({ ...prev, back: url }))}
            existingUrl={existingStatus?.backIdImage}
          />
          <VerificationDocuments
            mode="single"
            label="Personal Photo"
            accept="image/jpeg,image/png"
            maxSize={5 * 1024 * 1024}
            onUpload={(url) => setUploadedUrls((prev) => ({ ...prev, photo: url }))}
            existingUrl={existingStatus?.personalPhoto}
          />
          <VerificationDocuments
            mode="multiple"
            label="Professional Documents"
            accept="image/jpeg,image/png,application/pdf"
            maxSize={5 * 1024 * 1024}
            onUpload={(urls) => setDocumentUrls(urls as string[])}
            multiple
          />
          <VerificationDocuments
            mode="multiple"
            label="Portfolio"
            accept="image/jpeg,image/png"
            maxSize={5 * 1024 * 1024}
            onUpload={(urls) => setPortfolioUrls(urls as string[])}
            multiple
          />
        </div>

        {errors.documents && (
          <p className="text-sm font-medium text-destructive">{errors.documents.message as string}</p>
        )}

        <Button type="submit" disabled={submitMutation.isPending} className="w-full">
          {submitMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
