import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismadb";

interface ProductInfoType {
  productId: string;
  count: number;
}

export const POST = async (req: Request) => {
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];
    const addressString = addressComponents
      .filter((a) => a !== null)
      .join(", ");

    if (event.type === "checkout.session.completed") {
      await prismaDB.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session.customer_details?.phone || "",
        },
        include: {
          orderItems: true,
        },
      });

      const productInfo: string | undefined = session?.metadata?.productInfo;
      if (productInfo) {
        const infos: ProductInfoType[] = JSON.parse(productInfo);
        for (const productInfo of infos) {
          const { productId, count } = productInfo;

          const currentProduct = await prismaDB.product.findUnique({
            where: {
              id: productId,
            },
          });

          if (!currentProduct) {
            continue;
          }

          const newStock = currentProduct.stock - count;
          await prismaDB.product.update({
            where: {
              id: productId,
            },
            data: {
              stock: newStock,
              isArchived: newStock <= 0, // Set isArchived to true if stock is zero or negative
            },
          });
        }
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, {
      status: 400,
    });
  }
};
