import NavBar from './NavBar'
import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

export const queryDepartments = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'departments',
      limit: 250,
      pagination: false,
      sort: 'orderInDepartments',
      depth: 1,
      select: {
        title: true,
        slug: true,
        image: true,
        // description: true,
      },
    })

    return result.docs || null
  },
  ['web-courses', 'departments'],
  {
    tags: ['web-courses', 'departments'],
  },
)

const getIsLoggedIn = async (): Promise<boolean> => {
  try {
    const reqHeaders = await headers()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: reqHeaders })
    return !!user
  } catch {
    return false
  }
}

const Header = async () => {
  try {
    const [results, isLoggedIn] = await Promise.all([
      queryDepartments(),
      getIsLoggedIn(),
    ])
    return <NavBar departments={results} isLoggedIn={isLoggedIn} />
  } catch (error) {
    return <NavBar departments={[{ title: "Not Available, Try Refreshing Browser", slug: "/" }]} isLoggedIn={false} />
  }

}

export default Header
