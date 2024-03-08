import { currentUser, redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/db/db'

export const setupUser = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn()
  }

  const profile = await db.user.findUnique({
    where: {
      userId: user.id
    },
    include: {
      stores: true
    }
  })

  if (profile){
    return profile
  }

  const newProfile = await db.user.create({
    data: {
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: 'USER',
    }
  })

  return newProfile
}