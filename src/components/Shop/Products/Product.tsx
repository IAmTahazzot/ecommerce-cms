"use client";

import React, { useEffect, useState } from "react";
import { ProductType } from "./Products";
import Image from "next/image";
// import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoStarSharp, IoStarHalfSharp } from "react-icons/io5";
import { MdOutlineStarOutline } from "react-icons/md";

import { cn } from "@/lib/utils";
import { CartItem, Review, User, Variant } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { BsPlusLg } from "react-icons/bs";
import { HiMiniMinus } from "react-icons/hi2";
import DOMPurify from "dompurify";
import { useCart } from "@/hooks/useCart";
import { ModalType, useModal } from "@/hooks/useModal";
import { toast } from "sonner";

const extractVariants = (variants: Variant[]) => {
  const variantsData = {
    sizes: new Set<string>(),
    colors: new Set<string>(),
    materials: new Set<string>(),
  };

  variants.forEach((variant) => {
    if (variant.size) {
      variantsData.sizes.add(variant.size);
    }

    if (variant.color) {
      variantsData.colors.add(variant.color);
    }

    if (variant.material) {
      variantsData.materials.add(variant.material);
    }
  });

  return {
    sizes: Array.from(variantsData.sizes),
    colors: Array.from(variantsData.colors),
    materials: Array.from(variantsData.materials),
  };
};

export type CartItemType = {
  product: ProductType;
  quantity: number;
  variant?: Variant;
  storeUrl: string;
};

export const buyProduct = async ({
  carts,
  product,
  quantity,
  shopUrl,
  selectedVariant,
  setBuying,
  addToCart,
  openModal,
}: {
  carts: (CartItemType & { id: number })[];
  product: ProductType;
  quantity: number;
  shopUrl: string;
  selectedVariant: { size: string; color: string; material: string } | null;
  setBuying: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (item: CartItemType & { id: number }) => void;
  openModal: (modal: ModalType) => void;
}) => {
  setBuying(true);

  // check if product is already in cart and update quantity
  const existingCartItem = carts.find(
    (cart) =>
      cart.product.productId === product.productId &&
      (!product.variants ||
        product.variants.length === 0 ||
        (cart.variant &&
          selectedVariant &&
          cart.variant.size === selectedVariant.size &&
          cart.variant.color === selectedVariant.color &&
          cart.variant.material === selectedVariant.material))
  );

  if (existingCartItem) {
    // duplicate product
    toast.info(
      "Product already in cart. You may update the quantity in the cart."
    );
    openModal(ModalType.CART);
    setBuying(false);
    return false;
  }

  try {
    const data: CartItemType = {
      product,
      quantity,
      storeUrl: shopUrl,
    };

    if (product.variants && product.variants.length > 0 && selectedVariant) {
      const variant = product.variants.find(
        (variant) =>
          variant.size === selectedVariant.size &&
          variant.color === selectedVariant.color &&
          variant.material === selectedVariant.material
      );

      if (variant) {
        data.variant = variant;
      }
    }

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res: {
      data: CartItemType & CartItem & { id: number };
      message: string;
    } = await response.json();
    res.data.id = res.data.cartItemId;

    if (response.ok) {
      addToCart(res.data);
      toast.success(res.message);
      openModal(ModalType.CART);
    }

    setBuying(false);
  } catch (err) {
    toast.error("Failed to add product to cart, Please try later!");
    setBuying(false);
  }
};

export const Product = ({
  product,
  shopUrl,
}: {
  product: ProductType;
  shopUrl: string;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState({
    size: "",
    color: "",
    material: "",
  });
  const [view, setView] = useState<"description" | "reviews">("reviews");
  const [safeDescription, setSafeDescription] = useState<string>("");
  const variants = extractVariants(product.variants || []);
  const [buying, setBuying] = useState<boolean>(false);
  const { addToCart, carts } = useCart();
  const { openModal } = useModal();

  const price =
    product.variants && product.variants.length > 0
      ? product.variants.find(
          (variant) =>
            variant.size === selectedVariant.size &&
            variant.color === selectedVariant.color &&
            variant.material === selectedVariant.material
        )?.price || product.price
      : product.price;

  useEffect(() => {
    setSafeDescription(DOMPurify.sanitize(product.description || ""));
  }, [product.description]);

  // set first variant as selected
  if (!selectedVariant.size && variants.sizes.length > 0) {
    setSelectedVariant((prev) => {
      return {
        ...prev,
        size: variants.sizes[0],
      };
    });
  }

  if (!selectedVariant.color && variants.colors.length > 0) {
    setSelectedVariant((prev) => {
      return {
        ...prev,
        color: variants.colors[0],
      };
    });
  }

  if (!selectedVariant.material && variants.materials.length > 0) {
    setSelectedVariant((prev) => {
      return {
        ...prev,
        material: variants.materials[0],
      };
    });
  }

  const reviewAvg =
    product.Review &&
    product.Review.reduce(
      (acc, review) => acc + Number(review.reviewLevel),
      0
    ) / product.Review.length;

  const reviews = product.Review && (
    <div className="flex items-center mt-2">
      {Array.from({ length: 5 }).map((_, index) => {
        if (!reviewAvg)
          return <IoStarSharp key={index} className="text-neutral-300" />;

        if (reviewAvg >= index + 1) {
          return <IoStarSharp key={index} className="text-primary-500" />;
        } else if (reviewAvg >= index + 0.5) {
          return <IoStarHalfSharp key={index} className="text-primary-500" />;
        } else {
          return <IoStarSharp key={index} className="text-neutral-300" />;
        }
      })}
      <span className="text-neutral-500 ml-2">({product.Review.length})</span>
    </div>
  );

  return (
    <div className="grid grid-cols-[200px_1fr_1fr] gap-6">
      {/* [BEGIN]: First column*/}
      <div className="flex flex-col gap-4">
        {product.images.map((image, index) => {
          return (
            <div
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "w-32 h-28 relative rounded-md overflow-hidden cursor-pointer",
                index === currentImage && "border-2 border-neutral-900"
              )}
            >
              <Image
                src={"https://utfs.io/f/" + image.imageUrl}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover w-full h-full rounded"
                priority={false}
              />
            </div>
          );
        })}
      </div>
      <div className="relative h-[500px] rounded-md overflow-hidden">
        <Image
          src={"https://utfs.io/f/" + product.images[currentImage].imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover w-full h-full rounded-md"
          priority
        />
      </div>
      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-medium">{product.title}</h1>
          {reviews}
        </div>

        {variants.sizes.length > 0 && (
          <div>
            <h3 className="text-xl">Sizes</h3>
            <div className="flex items-center gap-x-3 mt-3">
              {variants.sizes.map((size, index) => {
                return (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedVariant((prev) => {
                        return {
                          ...prev,
                          size,
                        };
                      })
                    }
                    className={cn(
                      "rounded-full py-3 px-8 border border-spacing-2 hover:border-black",
                      selectedVariant?.size === size
                        ? "border-2 border-black"
                        : "border-neutral-300"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {variants.colors.length > 0 && (
          <div>
            <h3 className="text-xl">Colors</h3>
            <div className="flex items-center gap-x-3 mt-3">
              {variants.colors.map((color, index) => {
                return (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedVariant((prev) => {
                        return {
                          ...prev,
                          color,
                        };
                      })
                    }
                    className={cn(
                      "rounded-full py-3 px-8 border border-spacing-2 hover:border-black",
                      selectedVariant?.color === color
                        ? "border-2 border-black"
                        : "border-neutral-300"
                    )}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {variants.materials.length > 0 && (
          <div>
            <h3 className="text-xl">Materials</h3>
            <div className="flex items-center gap-x-3 mt-3">
              {variants.materials.map((material, index) => {
                return (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedVariant((prev) => {
                        return {
                          ...prev,
                          material,
                        };
                      })
                    }
                    className={cn(
                      "rounded-full py-3 px-8 border border-spacing-2 hover:border-black",
                      selectedVariant?.material === material
                        ? "border-2 border-black"
                        : "border-neutral-300"
                    )}
                  >
                    {material}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-5xl font-medium mb-5">${price.toFixed(2)}</h2>
          <div className="flex items-center gap-x-6">
            <div className="flex items-center">
              <Button
                className="border-black h-12 w-12 rounded-full"
                variant="outline"
                size="icon"
                onClick={() => setQuantity((prev) => prev - 1)}
              >
                <HiMiniMinus size={24} />
              </Button>
              <span className="mx-3 w-7 text-center">{quantity}</span>
              <Button
                className="border-black h-12 w-12 rounded-full"
                variant="outline"
                size="icon"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                <BsPlusLg size={24} />
              </Button>
            </div>
            <button
              onClick={() => {
                buyProduct({
                  carts,
                  product,
                  quantity,
                  shopUrl,
                  selectedVariant,
                  setBuying,
                  addToCart,
                  openModal,
                });
              }}
              className="w-full font-medium text-xl rounded-full bg-white border border-black text-center py-3 px-4 hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center group/btn"
            >
              {buying ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-7 w-7 text-black dark:text-white group-hover/btn:text-white"
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
      </div>
      {/* [END]: First column*/}

      {/* [BEGIN]: Second column*/}
      <div className="col-span-3 lg:col-span-2">
        <div className="border-b border-neutral-200 pt-6 flex items-end gap-x-4">
          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none py-6",
              view === "description" && "border-b-2 border-black"
            )}
            onClick={() => setView("description")}
          >
            <h2 className="text-base">Description</h2>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none py-6",
              view === "reviews" && "border-b-2 border-black"
            )}
            onClick={() => setView("reviews")}
          >
            <h2 className="text-base">Reviews</h2>
          </Button>
        </div>

        <div className="mt-10">
          {view === "description" && (
            <div>
              {/* <p className='mt-4 text-lg'>{product.description}</p> */}
              <div
                className="text-lg description"
                dangerouslySetInnerHTML={{
                  __html: safeDescription || "No description found.",
                }}
              ></div>
            </div>
          )}

          {view === "reviews" &&
            product.Review &&
            product.Review.length > 0 &&
            reviewAvg && (
              <div>
                <div>
                  {/* review star with rounded progress static bar black color and left side count of review number for one to five */}
                  <div className="flex items-center gap-x-4 mb-6">
                    <h2 className="text-3xl font-medium">Reviews</h2>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, index) => {
                        if (reviewAvg >= index + 1) {
                          return (
                            <IoStarSharp
                              key={index}
                              className="text-primary-500"
                            />
                          );
                        } else if (reviewAvg >= index + 0.5) {
                          return (
                            <IoStarHalfSharp
                              key={index}
                              className="text-primary-500"
                            />
                          );
                        } else {
                          return (
                            <IoStarSharp
                              key={index}
                              className="text-neutral-300"
                            />
                          );
                        }
                      })}
                    </div>
                    <span className="text-lg">
                      ({product.Review && product.Review.length})
                    </span>
                  </div>

                  <div className="flex items-start gap-x-4 flex-col-reverse">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const count =
                        product.Review &&
                        product.Review.filter(
                          (review) => Number(review.reviewLevel) === index + 1
                        ).length;

                      return (
                        <div key={index}>
                          <div className="grid grid-cols-[50px_1fr_1fr] gap-4 items-center">
                            <span>{index + 1} star</span>
                            <div className="relative bg-neutral-200 rounded-full overflow-hidden h-3 w-[300px]">
                              <div
                                className="bg-black h-full"
                                style={{
                                  width: `${
                                    count &&
                                    product.Review &&
                                    (count / product.Review.length) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-lg">{count || 0}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-10">
                  {product.Review.map((review , index) => (
                    <div key={index} className="flex gap-y-3 flex-col mb-6">
                      <span className='text-lg font-semibold'>
                        {/* @ts-ignore */}
                        {review.user?.firstName || 'Ghost'}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => {
                          if (Number(review.reviewLevel) >= index + 1) {
                            return (
                              <IoStarSharp
                                key={index}
                                className="text-primary-500"
                              />
                            );
                          } else if (
                            Number(review.reviewLevel) >=
                            index + 0.5
                          ) {
                            return (
                              <IoStarHalfSharp
                                key={index}
                                className="text-primary-500"
                              />
                            );
                          } else {
                            return (
                              <IoStarSharp
                                key={index}
                                className="text-neutral-300"
                              />
                            );
                          }
                        })}
                      </div>
                      <p className="text-lg">{review.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {view === "reviews" &&
            product.Review &&
            product.Review.length === 0 && (
              <div>
                <p className="mt-4 text-lg">No reviews yet</p>
              </div>
            )}
        </div>
      </div>
      {/* [END]: Second column */}
    </div>
  );
};
