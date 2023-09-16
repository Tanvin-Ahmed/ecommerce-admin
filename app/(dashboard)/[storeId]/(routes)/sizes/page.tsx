import { SizeColumn } from "@/components/sizes/columns";
import SizeClient from "@/components/sizes/size-client";
import prismaDB from "@/lib/prismadb";
import { format } from "date-fns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismaDB.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
