import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface param {
  storeId: string;
  sizeId: string;
}

export const GET = async (req: Request, { params }: { params: param }) => {
  try {
    const { sizeId } = params;

    if (!sizeId) return new NextResponse("Size id required", { status: 400 });

    const size = await prismaDB.size.findUnique({
      where: { id: sizeId },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    return new NextResponse("Size not found", { status: 404 });
  }
};

export const PATCH = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, sizeId } = params;
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });
    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("Size id id is required", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value)
      return new NextResponse("Size value is required", { status: 400 });

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismaDB.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log("SIZE_PATCH_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, sizeId } = params;
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });
    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("Size id is required", { status: 400 });

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismaDB.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log("SIZE_DELETE_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
