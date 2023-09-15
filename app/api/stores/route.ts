import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await prismaDB.store.create({ data: { userId, name } });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.log("[STORE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
