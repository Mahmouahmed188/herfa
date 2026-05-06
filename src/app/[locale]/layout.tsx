import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Manrope } from 'next/font/google';
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import LocalePersistence from '@/components/common/LocalePersistence';
import { Providers } from '@/components/providers';
import "../globals.css";

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${manrope.variable} font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden flex flex-col min-h-screen`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocalePersistence />
          <Providers>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
