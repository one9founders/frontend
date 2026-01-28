import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const category = searchParams.get("category");
    const pricingType = searchParams.get("pricingType");
    const featured = searchParams.get("featured");
    const startupFriendly = searchParams.get("startupFriendly");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category) {
      where.categories = {
        some: {
          slug: category,
        },
      };
    }

    if (pricingType) {
      where.pricingType = pricingType;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (startupFriendly === "true") {
      where.startupFriendly = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tools, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        include: {
          categories: true,
        },
        orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.tool.count({ where }),
    ]);

    return NextResponse.json({
      tools,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, website, ...rest } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const tool = await prisma.tool.create({
      data: {
        name,
        slug,
        description,
        website,
        ...rest,
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    );
  }
}
