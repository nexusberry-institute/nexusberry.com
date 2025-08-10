import type { MetadataRoute } from 'next'

// update this on route change
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.nexusberry.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/',
        '/account/', '/accounts/', '/cms/', '/lms/', '/coursework/', '/reports/',
        '/login/', '/logout/', 'register', '/recover-password/', "reset-password", 'set-password'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}