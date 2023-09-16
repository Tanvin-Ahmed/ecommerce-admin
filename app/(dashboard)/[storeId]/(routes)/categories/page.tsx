import CategoryClient from "@/components/categories/category-client";
import { CategoryColumn } from "@/components/categories/columns";
import prismaDB from "@/lib/prismadb";
import { format } from "date-fns";

const Categories = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismaDB.category.findMany({
    where: { storeId: params.storeId },
    include: {
      billboard: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Categories;
