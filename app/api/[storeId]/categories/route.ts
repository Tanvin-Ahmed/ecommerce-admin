import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismaDB.category.create({
      data: { name, billboardId, storeId: params.storeId },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismaDB.category.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
