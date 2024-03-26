import { db } from "@/db/db";

export const GET = async () => {
  try {
    const stores = await db.store.findMany();
    return new Response(JSON.stringify({
      data: stores
    }), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (err) {
    return new Response('Internal error', { status: 500 });
  }
};
