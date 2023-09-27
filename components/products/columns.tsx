"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

interface ColorType {
  id: string;
  value: string;
  name: string;
}
interface SizeType {
  id: string;
  value: string;
  name: string;
}

export type ProductColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  stock: number;
  colors: ColorType[];
  sizes: SizeType[];
  category: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sizes",
    header: "Available sizes",
    cell: ({ row }) => (
      <div className="break-words">
        {row.original.sizes.map((size) => size.value).join(", ")}
      </div>
    ),
  },
  {
    accessorKey: "colors",
    header: "Available colors",
    cell: ({ row }) => (
      <div className="flex flex-wrap justify-start items-center gap-3">
        {row.original.colors.map((color) => (
          <div
            key={color.value}
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
