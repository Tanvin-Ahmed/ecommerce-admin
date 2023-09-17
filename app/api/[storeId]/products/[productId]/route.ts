import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface param {
  storeId: string;
  productId: string;
}

export const GET = async (req: Request, { params }: { params: param }) => {
  try {
    const { productId } = params;

    if (!productId)
      return new NextResponse("Product id required", { status: 400 });

    const product = await prismaDB.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return new NextResponse("Product not found", { status: 404 });
  }
};

export const PATCH = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, productId } = params;
    const { userId } = auth();
    const {
      name,
      price,
      categoryId,
      images,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    await prismaDB.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismaDB.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("PRODUCT_PATCH_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: param }) => {
  try {
    const { storeId, productId } = params;
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });
    if (!storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!productId)
      return new NextResponse("Product id is required", { status: 400 });

    const storeByUserId = await prismaDB.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismaDB.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("PRODUCT_DELETE_ERROR", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
