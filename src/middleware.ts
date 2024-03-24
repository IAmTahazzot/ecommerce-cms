import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // publicRoutes: ["/", "/api/uploadthing", "/api/products", "/shop/"],
  beforeAuth: (req) => {
    // console.log('---')
    // console.log(req.url.split('/')[3])
    // console.log('---')
  },

  publicRoutes(req) {
    if (req.url.split('/')[3] === 'shop') {
      return true;
    }

    if (req.url.split('/')[3] === 'api') {
      return true;
    }

    return false;
  },

  ignoredRoutes: ["/sign-in", "/sign-up"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
