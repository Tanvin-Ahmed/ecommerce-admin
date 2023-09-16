"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Heading from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "../ui/data-table";
import ApiList from "../ui/api-list";

interface ColorClientPropsType {
  data: ColorColumn[];
}

const ColorClient: React.FC<ColorClientPropsType> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const handleClick = () => {
    router.push(`/${params.storeId}/colors/new`);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage billboard for your store"
        />
        <Button onClick={handleClick}>
          <Plus /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="Api calls for Colors" />
      <ApiList entityIdName="colorId" entityName="colors" />
    </>
  );
};

export default ColorClient;
