import React from 'react'

// export const metadata = {
//   metadataBase: new URL(getServerSideURL()),
//   openGraph: mergeOpenGraph(),
//   twitter: {
//     card: 'summary_large_image',
//     creator: '@nexusberry',
//   },
// }

export default async function LMSLayout({ children }: { children: React.ReactNode }) {
    return { children }
}

