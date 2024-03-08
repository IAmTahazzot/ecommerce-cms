import Image from "next/image";

export const CoverImage = () => {
  return (
    <div>
      <div className="h-[720px] w-[1000px] mx-auto relative rounded-lg border overflow-hidden -translate-y-6 animate-in duration-500">
        <Image
          src="/cover.svg"
          fill
          alt="Cover Image"
          className="object-contain"
        />
      </div>
    </div>
  );
};
