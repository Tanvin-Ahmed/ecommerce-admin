import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const {
      name,
      price,
      categoryId,
      colorIds,
      sizeIds,
      images,
      isFeatured,
      isArchived,
      stock,
    } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!stock) {
      return new NextResponse("Stock is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    if (!sizeIds || sizeIds.length === 0) {
      return new NextResponse("Size ids is required", { status: 400 });
    }
    if (!colorIds || colorIds.length === 0) {
      return new NextResponse("Color ids is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
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

    const product = await prismaDB.product.create({
      data: {
        name,
        price,
        stock,
        categoryId,
        colors: {
          createMany: {
            data: colorIds.map((colorId: string) => ({
              colorId,
            })),
          },
        },
        sizes: {
          createMany: {
            data: sizeIds.map((sizeId: string) => ({
              sizeId,
            })),
          },
        },
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismaDB.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colors: {
          some: {
            color: {
              id: colorId,
            },
          },
        },
        sizes: {
          some: {
            size: {
              id: sizeId,
            },
          },
        },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        colors: {
          include: {
            color: true,
          },
        },
        sizes: {
          include: {
            size: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
