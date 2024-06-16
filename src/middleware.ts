import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes(req) {
    if (req.url.split('/')[3] === 'shop') {
      return true
    }

    if (req.url.split('/')[3] === 'api') {
      return true
    }

    return false
  },

  ignoredRoutes: ['/sign-in', '/sign-up'],
})

export const config = {
  //matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
