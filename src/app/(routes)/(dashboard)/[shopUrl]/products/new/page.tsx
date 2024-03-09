import { db } from "@/db/db";
import { NewProductForm } from "./components/NewProductForm";
import { currentUser } from "@clerk/nextjs";

import Link from 'next/link';
import { Button } from "@/components/ui/button";

const AddProductPage = async ({ params }: { params: { shopUrl: string } }) => {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="h-screen flex justify-center bg-neutral-50">
        <div className="w-[90%] md:w-[500px] self-start  p-4 my-4 text-neutral-800 border bg-white">
          <h3 className="mb-3 font-bold">Unauthorized access!</h3>
          <p className="text-xs">
            Sign in to access your store.
          </p>
          <Link href="/sign-in">
            <a>
              <Button>Sign in</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const store = await db.store.findFirst({
    where: {
      userId: user.id,
      storeUrl: params.shopUrl,
    }
  })

  if (!store) {
    return (
      <div className="h-screen flex justify-center bg-neutral-50">
        <div className="w-[90%] md:w-[500px] self-start  p-4 my-4 text-neutral-800 border bg-white">
          <h3 className="mb-3 font-bold">No store found.</h3>
          <p className="text-xs">
            You don&apos;t have a store with the url <strong>{params.shopUrl}</strong>.
          </p>
          <Link href='/'>
            <Button variant={'default'} size={'sm'} className='mt-4'>
              Go to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categories = await db.category.findMany({
    where: {
      storeUrl: params.shopUrl,
    },
  });


  return (
    <div>
      <NewProductForm categories={categories} storeId={store.storeId} userId={user.id} />
    </div>
  );
};

export default AddProductPage;
