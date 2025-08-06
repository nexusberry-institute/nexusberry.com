
export const checkAndCreateUser = async ({ data, operation, req }: any) => {

  if (operation === 'create') {

    try {

      const userExist = await req.payload.find({
        collection: 'users',
        where: {
          email: {
            equals: data.studentEmail
          }
        },
        select: {
          email: true,
        },
        depth: 0
      })

      if (!userExist.docs.length) {

        const newUser = await req.payload.create({
          collection: 'users',
          data: {
            email: data.studentEmail,
            password: data.studentPassword,
          }
        })

        data.user = newUser.id

      } else {
        data.user = userExist.docs[0].id
      }

    } catch (error) {
      console.log(error)
    }
  }
}