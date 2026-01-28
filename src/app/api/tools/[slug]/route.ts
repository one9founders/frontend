import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tool = await prisma.tool.findUnique({
      where: { slug, isActive: true },
      include: {
        categories: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        deals: {
          where: { isActive: true },
        },
      },
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    await prisma.tool.update({
      where: { id: tool.id },
      data: { viewsCount: { increment: 1 } },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.error("Error fetching tool:", error);
    return NextResponse.json(
      { error: "Failed to fetch tool" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const tool = await prisma.tool.update({
      where: { slug },
      data: body,
      include: {
        categories: true,
      },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.tool.update({
      where: { slug },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Tool deleted successfully" });
  } catch (error) {
    console.error("Error deleting tool:", error);
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    );
  }
}
