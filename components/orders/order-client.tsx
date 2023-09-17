"use client";
import Heading from "../ui/heading";
import { Separator } from "../ui/separator";
import React from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "../ui/data-table";

interface OrderClientPropsType {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientPropsType> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
