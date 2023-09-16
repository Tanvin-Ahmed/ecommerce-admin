import ColorForm from "@/components/colors/color-form";
import prismaDB from "@/lib/prismadb";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const color = await prismaDB.color.findUnique({
    where: { id: params.colorId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
