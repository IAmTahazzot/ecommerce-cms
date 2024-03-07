import { authMiddleware } from '@clerk/nextjs'
import { get } from 'http'

function getSubDomain(hostname: string) {
  const parts = hostname.split('.')
  return parts.length > 2 ? parts[0] : null
}

export default authMiddleware({
  publicRoutes: ['/', '/api'],
  afterAuth: (auth, req) => {
    // console.log(req.nextUrl)
    // console.log(req.headers.get('host') || '')
    // console.log(getSubDomain(req.headers.get('host') || ''))
  }
})

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};