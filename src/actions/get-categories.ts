import { db } from "@/db/db";
import { Category } from "@prisma/client";

const getCategories = async ({
  storeUrl,
}: {
  storeUrl: string;
}): Promise<Category[]> => {
  try {
    const response = await db.category.findMany({
      where: {
        storeUrl,
      },
    });

    return response;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
};

export default getCategories;
