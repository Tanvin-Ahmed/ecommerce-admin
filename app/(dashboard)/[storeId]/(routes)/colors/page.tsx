import ColorClient from "@/components/colors/color-client";
import { ColorColumn } from "@/components/colors/columns";
import prismaDB from "@/lib/prismadb";
import { format } from "date-fns";

const ColorPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismaDB.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedColor: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorClient data={formattedColor} />
      </div>
    </div>
  );
};

export default ColorPage;
