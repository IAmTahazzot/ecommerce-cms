"use client";

import Image from "next/image";
import { NavLink } from "../Navbar/NavMenu";
import { ProductType } from "./Products";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProductCard = ({ product }: { product: ProductType }) => {
  const reviewAvg =
    product.Review.reduce(
      (acc, review) => acc + Number(review.reviewLevel),
      0
    ) / product.Review.length;
  const reviews = (
    <div className="flex items-center mt-2">
      {Array.from({ length: 5 }).map((_, index) => {
        if (reviewAvg >= index + 1) {
          return <FaStar key={index} className="text-primary-500" />;
        } else if (reviewAvg >= index + 0.5) {
          return <FaStarHalfAlt key={index} className="text-primary-500" />;
        } else {
          return <FaStar key={index} className="text-neutral-300" />;
        }
      })}
      <span className="text-neutral-500 ml-2">({product.Review.length})</span>
    </div>
  );

  const path = usePathname();
  const shopUrl = "/shop/" + path.split("/")[2];

  const image =
    (product.images.length > 0 &&
      "https://utfs.io/f/" + product.images[0].imageUrl) ||
    "/placeholders/product-placeholder.png";

  return (
    <div className="flex flex-col w-full border rounded-[8px] overflow-hidden group/product">
      <figure className="relative h-[250px] overflow-hidden cursor-pointer">
        <Image
          src={image}
          fill
          className="object-cover group-hover/product:scale-110 transition-transform duration-[1s]"
          priority={true}
          alt={"watch"}
        />
      </figure>

      <div className="p-5 flex flex-col">
        <h3 className="text-[20px] mb-1">${product.price.toFixed(2)}</h3>
        <NavLink
          href={`${shopUrl}/product/${product.productId}`}
          label="Watch"
          className="inline-block mb-4"
        >
          <h1 className="text-3xl font-medium">{product.title}</h1>
        </NavLink>
        <Link href={`${shopUrl}/category/${product.category.categoryUrl}`}>
          <span className="text-neutral-700">
            {product.category.categoryName}
          </span>
        </Link>
        {reviews}
      </div>

      <div className="p-5 mb-3 flex-1 flex items-end">
        <button className="w-full font-medium text-xl rounded-full bg-white border border-black text-center py-3 px-4 hover:bg-black hover:text-white transition-colors duration-300">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
