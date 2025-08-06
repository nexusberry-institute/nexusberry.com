import NavBar from './NavBar'
import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

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

const Header = async () => {
  try {
    const results = await queryDepartments()
    return <NavBar departments={results} />
  } catch (error) {
    return <NavBar departments={[{ title: "Not Available, Try Refreshing Browser", slug: "/" }]} />
  }

}

export default Header
