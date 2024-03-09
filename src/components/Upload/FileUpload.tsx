"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
  endpoint: keyof OurFileRouter;
  onFileUploadComplete: (res: any) => void;
}

export const FileUpload = ({ endpoint, onFileUploadComplete }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onFileUploadComplete(res);
      }}
    />
  );
};
