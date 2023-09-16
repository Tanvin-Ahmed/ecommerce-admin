"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Heading from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "../ui/data-table";
import ApiList from "../ui/api-list";

interface CategoryClientPropsType {
  data: CategoryColumn[];
}

const CategoryClient: React.FC<CategoryClientPropsType> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const handleClick = () => {
    router.push(`/${params.storeId}/categories/new`);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button onClick={handleClick}>
          <Plus /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="Api calls for Categories" />
      <ApiList entityIdName="categoryId" entityName="categories" />
    </>
  );
};

export default CategoryClient;
