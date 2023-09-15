"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Heading from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "../ui/data-table";
import ApiList from "../ui/api-list";

interface BillboardClientPropsType {
  data: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientPropsType> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const handleClick = () => {
    router.push(`/${params.storeId}/billboards/new`);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboard for your store"
        />
        <Button onClick={handleClick}>
          <Plus /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="Api calls for Billboards" />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  );
};

export default BillboardClient;
