import Footer from "@/components/Shop/Footer/Footer";
import Header from "@/components/Shop/Navbar/Header";
import { db } from "@/db/db";
import { ModalProvider } from "@/providers/ModalProvider";
import Image from "next/image";
import { cookies } from "next/headers";
import { CartItemType } from "@/components/Shop/Products/Product";
import { currentUser } from "@clerk/nextjs";
import { Cart, CartItem, Variant } from "@prisma/client";
import { ProductType } from "@/components/Shop/Products/Products";
import { CartSetup } from "./components/CartSetup";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: { shopUrl: string };
}

const StoreLayout = async ({
  children,
  params: { shopUrl },
}: StoreLayoutProps) => {
  const user = await currentUser();

  const shop = await db.store.findUnique({
    where: {
      storeUrl: shopUrl,
    },
  });

  if (!shop) {
    return (
      <div className="flex items-center justify-center my-10">
        <Image src="/404.gif" alt="404" width={500} height={500} />
      </div>
    );
  }

  // getting carts if available by sessionId & userId
  const carts: (CartItemType & { id: number })[] = [];
  const sessionId = cookies().get("sessionId")?.value;

  let cart: Cart | null;

  if (user) {
    const res = await db.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    cart = res;
  } else {
    const res = await db.cart.findUnique({
      where: {
        sessionId: sessionId,
      },
    });

    cart = res;
  }

  if (cart) {
    const transformCartData = (data: (CartItem & { product: ProductType; variant: Variant | null})[]) => {
      data.forEach(cart => {
        if (cart.variant) {
          carts.push({
            id: cart.cartId,
            quantity: cart.quantity,
            product: cart.product,
            variant: cart.variant,
            storeUrl: shopUrl
          })
        }
      })
    };

    const cartItems = await db.cartItem.findMany({
      where: {
        cartId: cart.cartId,
      },
      include: {
        product: {
          include: {
            images: true
          }
        },
        variant: true,
      },
    });

    transformCartData(cartItems);
  }

  return (
    <>
      <CartSetup carts={carts} />
      <Header shopUrl={shopUrl} />
      {children}
      <Footer />
      <ModalProvider />
    </>
  );
};

export default StoreLayout;
