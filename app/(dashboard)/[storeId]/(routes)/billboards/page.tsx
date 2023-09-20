import BillboardClient from "@/components/billboard/billboard-client";
import { BillboardColumn } from "@/components/billboard/columns";
import prismaDB from "@/lib/prismadb";
import { Billboard } from "@prisma/client";
import { format } from "date-fns";

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards: Billboard[] = await prismaDB.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedBillboard: BillboardColumn[] = billboards.map(
    (billboard: Billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className={"flex-col"}>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardClient data={formattedBillboard} />
      </div>
    </div>
  );
};

export default Billboards;
