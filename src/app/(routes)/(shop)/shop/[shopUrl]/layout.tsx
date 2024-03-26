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
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: { shopUrl: string };
}

const StoreLayout = async ({
  children,
  params: { shopUrl },
}: StoreLayoutProps) => {
  const user = await currentUser();

  if (user) {
    try {
      // if logged in and user is not found create a new user
      const getUser = await db.user.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (getUser) {
        const newUser = await db.user.create({
          data: {
            userId: user.id,
            email:
              user.emailAddresses[Number(user.primaryEmailAddressId) || 0]
                .emailAddress,
            role: "USER",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          },
        });

        if (newUser) {
          redirect(`/shop/${shopUrl}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const shop = await db.store.findUnique({
    where: {
      storeUrl: shopUrl,
    },
  });

  if (!shop) {
    return (
      <div className="flex items-center justify-center my-10">
        <Image src="/404.gif" alt="404" width={500} height={500} unoptimized />
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
    if (sessionId) {
      const res = await db.cart.findUnique({
        where: {
          sessionId: sessionId,
        },
      });
      cart = res;
    } else {
      cart = null;
    }
  }

  if (cart) {
    const transformCartData = (
      data: (CartItem & { product: ProductType; variant: Variant | null })[]
    ) => {
      data.forEach((cart) => {
        if (cart.variant) {
          carts.push({
            id: cart.cartItemId,
            quantity: cart.quantity,
            product: cart.product,
            variant: cart.variant,
            storeUrl: shopUrl,
          });
        } else {
          carts.push({
            id: cart.cartItemId,
            quantity: cart.quantity,
            product: cart.product,
            storeUrl: shopUrl,
          });
        }
      });
    };

    const cartItems = await db.cartItem.findMany({
      where: {
        cartId: cart.cartId,
      },
      include: {
        product: {
          include: {
            images: true,
          },
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
      <Toaster position="bottom-right" richColors />
    </>
  );
};

export default StoreLayout;
