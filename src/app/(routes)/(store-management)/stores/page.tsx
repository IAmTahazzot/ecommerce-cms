"use client";

import { Store } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      const response = await fetch("/api/public/stores");
      const { data } = await response.json();
      setStores(data);
      setLoading(false);
      console.log(data);
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-8">
        <h1 className="text-2xl font-semibold">Loading stores...</h1>
        <p className="mt-2 text-neutral-500">Please wait a moment.</p>
      </div>
    );
  }

  return (
    <div>
      {!stores.length && (
        <div className="text-center mt-8">
          <h1 className="text-2xl font-semibold">No stores found</h1>
          <p className="mt-2 text-neutral-500">
            Unfortunately, there are no stores available at the moment.
          </p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-6 mt-8">
        {stores &&
          stores.map((store) => (
            <div
              key={store.storeUrl}
              className="rounded border p-6 group hover:bg-neutral-50 hover:dark:bg-neutral-900 transition-colors duration-100 "
            >
              <Link href={`/shop/${store.storeUrl}`} className='flex flex-col items-center'>
                <div className="h-12 w-12 rounded-full bg-black dark:bg-neutral-800 text-white flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                  {store.storeName
                    .split(" ")
                    .map((word) => word[0].toUpperCase())
                    .join("")}
                </div>
                <div className="mt-4 font-semibold">{store.storeName}</div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
