import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const checkAuth = () => {
  const { userId } = auth();
  if (!userId) {
    throw new UploadThingError("Unauthorized access!");
  }

  return { userId: userId };
}

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: '4MB'}})
    .middleware(() => checkAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
