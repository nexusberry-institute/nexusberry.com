const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/api/*',
    '/auth/*',
    '/_next/*',
    '/404',
    '/500'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
        allow: '/',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`, `${SITE_URL}/courses-sitemap.xml`, `${SITE_URL}/events-sitemap.xml`]
  },
}
