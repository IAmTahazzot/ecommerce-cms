import Image from "next/image";

export const CoverImage = () => {
  return (
    <div>
      <div className="h-[720px] w-[1000px] mx-auto relative rounded-lg border overflow-hidden">
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
