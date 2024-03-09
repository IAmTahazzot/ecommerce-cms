import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({
      message: 'Unauthorized',
      status: 401
    })
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
    }
  });

  // store product images
  if (body.images) {
    await db.image.createMany({
      data: [
        ...body.images.map(({ imageUrl }: { imageUrl: string }) => ({ productId: newProduct.productId, imageUrl }))
      ]
    })
  }

  // store product variants
  if (body.productVariants) {
    await db.variant.createMany({
      data: [
        ...body.productVariants.map((variant: {
          sizes: string;
          colors: string;
          materials: string;
        }) => {
          return {
            productId: newProduct.productId,
            size: variant.sizes || '',
            color: variant.colors || '',
            material: variant.materials || '',
            inventory: 0,
            price: 0,
            imageUrl: '',
            sku: `${newProduct.productId}-${variant.sizes || 'd'}-${variant.colors || ''}-${variant.materials || ''}`
          }
        })
      ]
    })
  }

  return NextResponse.json({
    message: 'Product created',
    status: 200,
    data: JSON.stringify(newProduct) 
  })
}