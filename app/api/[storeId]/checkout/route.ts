import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismaDB from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
interface InfoType {
  productId: string;
  count: number;
}

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { productInfo } = await req.json();

    if (!productInfo || !productInfo.length) {
      return new NextResponse("ProductId is required", { status: 400 });
    }

    const products = await prismaDB.product.findMany({
      where: {
        id: { in: productInfo.map((info: InfoType) => info.productId) },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      const item: InfoType = productInfo.find(
        (info: InfoType) => info.productId === product.id
      );
      line_items.push({
        quantity: item.count,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber() * 100,
        },
      });
    });

    const productIds = productInfo.map((info: InfoType) => info.productId);

    const order = await prismaDB.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((id: string) => ({
            product: {
              connect: { id },
            },
            pieces: (
              productInfo.find(
                (info: InfoType) => info.productId === id
              ) as InfoType
            ).count,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
        productInfo: JSON.stringify(productInfo),
      },
    });

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
