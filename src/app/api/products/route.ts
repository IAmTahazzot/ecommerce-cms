import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const products = await db.product.findMany({
    where: {
      storeId: 14,
    },
    include: {
      variants: true,
      images: true,
    },
  });

  return NextResponse.json({
    message: "Products fetched",
    status: 200,
    data: products,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  // create product
  const newProduct = await db.product.create({
    data: {
      userId: user.id,
      storeId: body.storeId,
      categoryId: body.categoryId,
      title: body.title,
      description: body.description,
      price: body.price,
      inventory: body.inventory,
      costPerProduct: body.costPerProduct,
      compareAtPrice: body.compareAtPrice,
      status: body.status,
      allowPurchaseOutOfStock: body.allowPurchaseOutOfStock,
    },
  });

  // store product images
  if (body.images) {
    await db.image.createMany({
      data: [
        ...body.images.map(({ imageUrl }: { imageUrl: string }) => ({
          productId: newProduct.productId,
          imageUrl,
        })),
      ],
    });
  }

  // store product variants
  if (body.variants) {
    await db.variant.createMany({
      data: [
        ...body.variants.map(
          (variant: {
            size: string;
            color: string;
            material: string;
            inventory: number;
            price: number;
          }) => {
            return {
              productId: newProduct.productId,
              size: variant.size || "",
              color: variant.color || "",
              material: variant.material || "",
              inventory: variant.inventory,
              price: variant.price,
              imageUrl: "",
              sku: `${newProduct.productId}-${variant.size || "d"}-${
                variant.color || ""
              }-${variant.material || ""}`,
            };
          }
        ),
      ],
    });
  }

  return NextResponse.json({
    message: "Product created",
    status: 200,
    data: newProduct,
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  if (!body.productId) {
    return NextResponse.json({
      message: "Product id is required",
      status: 400,
    });
  }

  const product = await db.product.update({
    where: {
      productId: body.productId,
    },
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      inventory: body.inventory,
      costPerProduct: body.costPerProduct,
      compareAtPrice: body.compareAtPrice,
      status: body.status,
      allowPurchaseOutOfStock: body.allowPurchaseOutOfStock,
    },
  });

  // delete previous image
  await db.image.deleteMany({
    where: {
      productId: product.productId,
    },
  });

  // store product images
  if (body.images) {
    await db.image.createMany({
      data: [
        ...body.images.map(({ imageUrl }: { imageUrl: string }) => ({
          productId: product.productId,
          imageUrl,
        })),
      ],
    });
  }

  // delete previous variants
  await db.variant.deleteMany({
    where: {
      productId: product.productId,
    },
  });
  // store product variants
  if (body.variants) {
    await db.variant.createMany({
      data: [
        ...body.variants.map(
          (variant: {
            size: string;
            color: string;
            material: string;
            inventory: number;
            price: number;
          }) => {
            return {
              productId: product.productId,
              size: variant.size || "",
              color: variant.color || "",
              material: variant.material || "",
              inventory: variant.inventory,
              price: variant.price,
              imageUrl: "",
              sku: `${product.productId}-${variant.size || "d"}-${
                variant.color || ""
              }-${variant.material || ""}`,
            };
          }
        ),
      ],
    });
  }

  return NextResponse.json({
    message: "Product updated",
    status: 200,
    data: JSON.stringify(product),
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  if (!body.productId) {
    return NextResponse.json({
      message: "Product id is required",
      status: 400,
    });
  }

  try {
    const response = await db.product.delete({
      where: {
        productId: body.productId,
      },
    });

    if (!response) {
      throw new Error("Unable to delete product");
    }

    return NextResponse.json({
      message: "Product deleted",
      status: 200,
    });

  } catch (error) {
    return NextResponse.json({
      message: (error as Error).message,
      status: 500,
    });
  }
}
