import { OrderColumn } from "@/components/orders/columns";
import OrderClient from "@/components/orders/order-client";
import prismaDB from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismaDB.order.findMany({
    where: { storeId: params.storeId },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((item) => item.product.name).join(", "),
    totalPrice: formatter.format(
      order.orderItems.reduce(
        (total, item) => total + Number(item.product.price) * item.pieces,
        0
      )
    ),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
