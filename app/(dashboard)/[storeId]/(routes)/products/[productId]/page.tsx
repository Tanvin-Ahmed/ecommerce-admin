import ProductForm from "@/components/products/product-form";
import prismaDB from "@/lib/prismadb";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismaDB.product.findUnique({
    where: { id: params.productId },
    include: { images: true },
  });

  const categories = await prismaDB.category.findMany({
    where: { storeId: params.storeId },
  });

  const colors = await prismaDB.color.findMany({
    where: { storeId: params.storeId },
  });

  const sizes = await prismaDB.size.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
