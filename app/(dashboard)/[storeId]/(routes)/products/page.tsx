import ProductClient from "@/components/products/product-client";
import { ProductColumn } from "@/components/products/columns";
import prismaDB from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismaDB.product.findMany({
    where: { storeId: params.storeId },
    include: {
      category: true,
      colors: { include: { color: true } },
      sizes: { include: { size: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProduct: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    stock: product.stock,
    category: product.category.name,
    colors: product.colors.map((color) => ({
      value: color.color.value,
      name: color.color.name,
      id: color.colorId,
    })),
    sizes: product.sizes.map((size) => ({
      value: size.size.value,
      name: size.size.name,
      id: size.sizeId,
    })),
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductClient data={formattedProduct} />
      </div>
    </div>
  );
};

export default ProductsPage;
