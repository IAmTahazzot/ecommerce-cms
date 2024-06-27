"use client";

import Image from "next/image";
import { NavLink } from "../Navbar/NavMenu";
import { ProductType } from "./Products";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buyProduct } from "./Product";
import { useCart } from "@/hooks/useCart";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [buying, setBuying] = useState(false);
  const { carts, addToCart } = useCart();
  const { openModal, closeModal } = useModal();
  const reviewAvg =
    product.Review &&
    product.Review.reduce(
      (acc, review) => acc + Number(review.reviewLevel),
      0
    ) / product.Review.length;

  const reviews = (
    <div className="flex items-center mt-2">
      {Array.from({ length: 5 }).map((_, index) => {
        if (!product.Review?.length || !reviewAvg) {
          return <FaStar key={index} className="text-neutral-300" />;
        }

        if (reviewAvg >= index + 1) {
          return <FaStar key={index} className="text-primary-500" />;
        } else if (reviewAvg >= index + 0.5) {
          return <FaStarHalfAlt key={index} className="text-primary-500" />;
        } else {
          return <FaStar key={index} className="text-neutral-300" />;
        }
      })}
      <span className="text-neutral-500 ml-2">
        ({product.Review && product.Review.length})
      </span>
    </div>
  );

  const path = usePathname();

  const segments = path.split("/").filter((segment) => segment !== "");
  const shopIndex = segments.findIndex((segment) => segment === "shop") + 1;
  const storeUrl = segments[shopIndex];
  const shopUrl = "/shop/" + storeUrl;

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
          className="object-cover group-hover/product:scale-110 transition-transform duration-1000"
          priority={true}
          sizes="(max-width: 640px) 100vw, 640px"
          alt={"product picture"}
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
        {product.category && (
          <Link href={`${shopUrl}/category/${product.category.categoryUrl}`}>
            <span className="text-neutral-700">
              {product.category.categoryName}
            </span>
          </Link>
        )}
        {reviews}
      </div>

      <div className="p-5 mb-3 flex-1 flex items-end">
        <button
          onClick={() => {
            buyProduct({
              carts,
              product,
              shopUrl: storeUrl,
              addToCart,
              openModal,
              selectedVariant: null,
              quantity: 1,
              setBuying,
            });
          }}
          className="w-full font-medium text-xl rounded-full bg-white border border-black text-center py-3 px-4 hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center group"
        >
          {buying ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-7 w-7 text-black dark:text-white group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Buy"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
