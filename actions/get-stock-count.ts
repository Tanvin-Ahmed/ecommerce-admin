import prismaDB from "@/lib/prismadb";

export const getStackCount = async (storeId: string) => {
  const salesCount = await prismaDB.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return salesCount;
};
