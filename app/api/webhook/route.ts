import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismadb";

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
      const order = await prismaDB.order.update({
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

      const productIds = order.orderItems.map((item) => item.productId);

      await prismaDB.product.updateMany({
        where: {
          id: {
            in: productIds,
          },
        },
        data: {
          isArchived: true,
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, {
      status: 400,
    });
  }
};
