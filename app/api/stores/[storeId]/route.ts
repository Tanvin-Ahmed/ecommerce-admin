import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface param {
  storeId: string;
}

// export const GET = async (req: Request, { params }: { params: param }) => {
//   try {
//     const { userId } = auth();
//     const { storeId } = params;

//     if (!userId) return new NextResponse("Unauthorized!", { status: 401 });
//     if (!storeId) return new NextResponse("storeId required", { status: 400 });

//     const store = await prismaDB.store.findFirst({
//       where: { id: storeId, userId },
//     });

//     return NextResponse.json(store, { status: 200 });
//   } catch (error) {
//     return new NextResponse("Store not found", { status: 404 });
//   }
// };

export const PATCH = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId } = params;
    const { userId } = auth();
    const { name } = await req.json();

    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    const store = await prismaDB.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("STORE_PATCH_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId } = params;
    const { userId } = auth();

    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    const store = await prismaDB.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    });

    return new NextResponse("Delete successfully", { status: 200 });
  } catch (error) {
    console.log("STORE_DELETE_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
