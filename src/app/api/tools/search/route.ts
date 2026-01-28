import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, pricingType, limit = 20 } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
      ],
    };

    if (category) {
      where.categories = {
        some: { slug: category },
      };
    }

    if (pricingType) {
      where.pricingType = pricingType;
    }

    const tools = await prisma.tool.findMany({
      where,
      include: {
        categories: true,
      },
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
      take: limit,
    });

    await prisma.searchQuery.create({
      data: {
        query,
        resultsCount: tools.length,
        filters: { category, pricingType },
      },
    });

    return NextResponse.json({
      tools,
      count: tools.length,
      query,
    });
  } catch (error) {
    console.error("Error searching tools:", error);
    return NextResponse.json(
      { error: "Failed to search tools" },
      { status: 500 }
    );
  }
}
