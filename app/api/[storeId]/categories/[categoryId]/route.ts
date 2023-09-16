import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface param {
  storeId: string;
  categoryId: string;
}

export const GET = async (req: Request, { params }: { params: param }) => {
  try {
    const { categoryId } = params;

    if (!categoryId)
      return new NextResponse("Category id required", { status: 400 });

    const category = await prismaDB.category.findUnique({
      where: { id: categoryId },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return new NextResponse("Category not found", { status: 404 });
  }
};

export const PATCH = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, categoryId } = params;
    const { userId } = auth();
    const { name, billboardId } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });
    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category id is required", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismaDB.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("CATEGORY_PATCH_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, categoryId } = params;
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });
    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category id is required", { status: 400 });

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismaDB.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("CATEGORY_DELETE_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
