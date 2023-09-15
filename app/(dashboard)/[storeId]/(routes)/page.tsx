import prismaDB from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismaDB.store.findFirst({
    where: { id: params.storeId },
  });

  return <div>Active store: {store?.name}</div>;
};

export default DashboardPage;
