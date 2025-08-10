import React from 'react'
import { Montserrat } from 'next/font/google'
import { Open_Sans } from 'next/font/google'
import { cn } from 'src/utilities/cn'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import { Toaster } from '@/components/ui/toaster'
import WhatsappButton from '../(frontend)/(website)/_components/WhatsappButton'
import { getSettings } from "@/lib/getSettings";
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html className={cn(montserrat.variable, openSans.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/icons/favi.jpg" rel="icon" sizes="32x32" />
        <link href="/icons/favi.jpg" rel="icon" type="image/svg+xml" />
        <link
          rel="sitemap"
          type="application/xml"
          href="/sitemap.xml"
        />
      </head>
      <body>
        <Toaster />
        <Providers>
          {children}
          <WhatsappButton
            phoneNumber={settings.whatsappPhoneNumber ?? ''}
            enabled={settings.enableWhatsappButton ?? false}
            defaultMessage={settings.whatsappDefaultMessage ?? ''} />
        </Providers>
      </body>
    </html>
  )
}

// export const metadata = {
//   metadataBase: new URL(getServerSideURL()),
//   openGraph: mergeOpenGraph(),
//   twitter: {
//     card: 'summary_large_image',
//     creator: '@nexusberry',
//   },
// }