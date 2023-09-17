"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Heading from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "../ui/data-table";
import ApiList from "../ui/api-list";

interface ProductClientPropsType {
  data: ProductColumn[];
}

const ProductClient: React.FC<ProductClientPropsType> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const handleClick = () => {
    router.push(`/${params.storeId}/products/new`);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button onClick={handleClick}>
          <Plus /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="Api calls for Products" />
      <ApiList entityIdName="productId" entityName="products" />
    </>
  );
};

export default ProductClient;
