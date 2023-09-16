import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface param {
  storeId: string;
  colorId: string;
}

export const GET = async (req: Request, { params }: { params: param }) => {
  try {
    const { colorId } = params;

    if (!colorId) return new NextResponse("Color id required", { status: 400 });

    const color = await prismaDB.color.findUnique({
      where: { id: colorId },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    return new NextResponse("Color not found", { status: 404 });
  }
};

export const PATCH = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, colorId } = params;
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });
    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!colorId)
      return new NextResponse("Color id is required", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value)
      return new NextResponse("Color value is required", { status: 400 });

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismaDB.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("COLOR_PATCH_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, colorId } = params;
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });
    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!colorId)
      return new NextResponse("Color id is required", { status: 400 });

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismaDB.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("COLOR_DELETE_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
