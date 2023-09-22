import prismaDB from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismaDB.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
